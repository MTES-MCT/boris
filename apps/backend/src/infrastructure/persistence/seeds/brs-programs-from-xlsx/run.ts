import * as fs from 'node:fs';
import * as zlib from 'node:zlib';
import dataSource from 'src/infrastructure/persistence/typeorm.config';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

type ProgramRow = {
  regionName: string;
  ofsName: string;
  programName: string;
  departementName: string;
  city: string;
  inseeCode: string;
  streetNumber: string;
  streetName: string;
  deliveryMonth: string;
};

type GeocodedFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    city?: string;
    postcode?: string;
    citycode?: string;
    label?: string;
  };
};

const SOURCE = 'xlsx:liste-brs-adresse-ofs-2024-12-31';

const normalizeName = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

const decodeXml = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const columnIndex = (cellReference: string): number => {
  const column = cellReference.replace(/[0-9]/g, '');

  return [...column].reduce(
    (total, character) => total * 26 + character.charCodeAt(0) - 64,
    0,
  );
};

const unzipEntries = (buffer: Buffer): Map<string, Buffer> => {
  const entries = new Map<string, Buffer>();
  const endSignature = 0x06054b50;
  let endOffset = buffer.length - 22;

  while (endOffset >= 0 && buffer.readUInt32LE(endOffset) !== endSignature) {
    endOffset--;
  }

  if (endOffset < 0) {
    throw new Error('Invalid XLSX file: ZIP central directory not found.');
  }

  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let centralDirectoryOffset = buffer.readUInt32LE(endOffset + 16);

  for (let i = 0; i < entryCount; i++) {
    const compressionMethod = buffer.readUInt16LE(centralDirectoryOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralDirectoryOffset + 20);
    const fileNameLength = buffer.readUInt16LE(centralDirectoryOffset + 28);
    const extraLength = buffer.readUInt16LE(centralDirectoryOffset + 30);
    const commentLength = buffer.readUInt16LE(centralDirectoryOffset + 32);
    const localHeaderOffset = buffer.readUInt32LE(centralDirectoryOffset + 42);
    const fileName = buffer
      .subarray(
        centralDirectoryOffset + 46,
        centralDirectoryOffset + 46 + fileNameLength,
      )
      .toString('utf8');

    const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataOffset =
      localHeaderOffset + 30 + localFileNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);

    if (compressionMethod === 0) {
      entries.set(fileName, compressed);
    } else if (compressionMethod === 8) {
      entries.set(fileName, zlib.inflateRawSync(compressed));
    }

    centralDirectoryOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
};

const parseSharedStrings = (xml: string): string[] => {
  const sharedStrings: string[] = [];
  const sharedStringMatches = xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g);

  for (const match of sharedStringMatches) {
    const text = [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((textMatch) => decodeXml(textMatch[1]))
      .join('');

    sharedStrings.push(text);
  }

  return sharedStrings;
};

const parseWorksheet = (xml: string, sharedStrings: string[]): string[][] => {
  const rows: string[][] = [];
  const rowMatches = xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g);

  for (const rowMatch of rowMatches) {
    const row: string[] = [];
    const cellMatches = rowMatch[1].matchAll(
      /<c\b([^>]*)>(?:[\s\S]*?<v>([\s\S]*?)<\/v>|[\s\S]*?<is>[\s\S]*?<t\b[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>)?[\s\S]*?<\/c>/g,
    );

    for (const cellMatch of cellMatches) {
      const attributes = cellMatch[1];
      const reference = attributes.match(/\br="([^"]+)"/)?.[1];

      if (!reference) {
        continue;
      }

      const cellType = attributes.match(/\bt="([^"]+)"/)?.[1];
      const rawValue = cellMatch[2] ?? cellMatch[3] ?? '';
      const value =
        cellType === 's'
          ? sharedStrings[Number(rawValue)] || ''
          : decodeXml(rawValue);

      row[columnIndex(reference) - 1] = value.trim();
    }

    rows.push(row);
  }

  return rows;
};

const readProgramRows = (filePath: string): ProgramRow[] => {
  const entries = unzipEntries(fs.readFileSync(filePath));
  const sheetXml = entries.get('xl/worksheets/sheet1.xml');

  if (!sheetXml) {
    throw new Error('Invalid XLSX file: xl/worksheets/sheet1.xml not found.');
  }

  const sharedStrings = parseSharedStrings(
    entries.get('xl/sharedStrings.xml')?.toString('utf8') || '',
  );
  const rows = parseWorksheet(sheetXml.toString('utf8'), sharedStrings);

  return rows.slice(1).flatMap((row) => {
    const programRow: ProgramRow = {
      regionName: row[0] || '',
      ofsName: row[1] || '',
      programName: row[2] || '',
      departementName: row[3] || '',
      city: row[4] || '',
      inseeCode: row[5] || '',
      streetNumber: row[6] || '',
      streetName: row[7] || '',
      deliveryMonth: row[8] || '',
    };

    if (!programRow.ofsName || !programRow.city || !programRow.inseeCode) {
      return [];
    }

    return [programRow];
  });
};

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const geocodeAddress = async (
  row: ProgramRow,
): Promise<GeocodedFeature | null> => {
  const address = [row.streetNumber, row.streetName, row.city]
    .filter(Boolean)
    .join(' ');
  const url = new URL('https://data.geopf.fr/geocodage/search');
  url.searchParams.set('q', address);
  url.searchParams.set('citycode', row.inseeCode);
  url.searchParams.set('autocomplete', '0');
  url.searchParams.set('index', 'address');
  url.searchParams.set('limit', '1');
  url.searchParams.set('returntruegeometry', 'false');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = (await response.json()) as { features?: GeocodedFeature[] };

  return data.features?.[0] || null;
};

const fullAddress = (row: ProgramRow): string =>
  [row.streetNumber, row.streetName, row.city].filter(Boolean).join(' ');

async function run(): Promise<void> {
  const xlsxPath = process.argv[2];

  if (!xlsxPath) {
    throw new Error(
      'Missing XLSX path. Usage: npm run seed:brs-programs-from-xlsx -- /path/to/file.xlsx',
    );
  }

  const rows = readProgramRows(xlsxPath);
  const delay = Number(process.env.GEOCODE_DELAY_MS || 250);

  await dataSource.initialize();

  const brsDiffusionWebsiteRepository = dataSource.getRepository(
    BrsDiffusionWebsiteEntity,
  );
  const ofsRepository = dataSource.getRepository(OfsEntity);
  const departementRepository = dataSource.getRepository(DepartementEntity);
  const ofss = await ofsRepository.find({
    relations: ['departements', 'regions', 'distributors'],
  });
  const ofsByName = new Map(ofss.map((ofs) => [normalizeName(ofs.name), ofs]));

  let inserted = 0;
  let skipped = 0;
  let unmatchedOfs = 0;
  let geocodingFailures = 0;

  for (const [index, row] of rows.entries()) {
    const ofs = ofsByName.get(normalizeName(row.ofsName));

    if (!ofs) {
      unmatchedOfs++;
      console.log(
        `${index + 1}/${rows.length} - OFS introuvable: ${row.ofsName}`,
      );
      continue;
    }

    const existing = await brsDiffusionWebsiteRepository
      .createQueryBuilder('brs_diffusion_website')
      .where('brs_diffusion_website.source = :source', { source: SOURCE })
      .andWhere('brs_diffusion_website.ofsName = :ofsName', {
        ofsName: row.ofsName,
      })
      .andWhere('brs_diffusion_website.address = :address', {
        address: fullAddress(row),
      })
      .andWhere('brs_diffusion_website.inseeCode = :inseeCode', {
        inseeCode: row.inseeCode,
      })
      .andWhere(
        row.programName
          ? 'brs_diffusion_website.programName = :programName'
          : 'brs_diffusion_website.programName IS NULL',
        { programName: row.programName },
      )
      .getOne();

    if (existing) {
      skipped++;
      continue;
    }

    const geocodedAddress = await geocodeAddress(row);
    await sleep(delay);

    if (!geocodedAddress?.geometry?.coordinates) {
      geocodingFailures++;
      console.log(
        `${index + 1}/${rows.length} - Adresse introuvable: ${fullAddress(row)}`,
      );
      continue;
    }

    const departement = await departementRepository.findOne({
      where: {
        code: row.inseeCode.slice(0, row.inseeCode.startsWith('97') ? 3 : 2),
      },
      relations: ['region'],
    });

    if (!departement) {
      skipped++;
      console.log(
        `${index + 1}/${rows.length} - Département introuvable: ${row.inseeCode}`,
      );
      continue;
    }

    const [longitude, latitude] = geocodedAddress.geometry.coordinates;

    await brsDiffusionWebsiteRepository.save(
      new BrsDiffusionWebsiteEntity(
        SOURCE,
        'Non renseigné',
        row.ofsName,
        geocodedAddress.properties?.city || row.city,
        geocodedAddress.properties?.postcode || '',
        fullAddress(row),
        row.inseeCode,
        latitude,
        longitude,
        departement.region,
        departement,
        ofs,
        row.programName || null,
        row.deliveryMonth || null,
      ),
    );

    inserted++;
    console.log(`${index + 1}/${rows.length} - ${row.city} - ${row.ofsName}`);
  }

  console.log(
    `Import terminé: ${inserted} insérés, ${skipped} ignorés, ${unmatchedOfs} OFS introuvables, ${geocodingFailures} adresses non géocodées.`,
  );

  await dataSource.destroy();
}

void run();
