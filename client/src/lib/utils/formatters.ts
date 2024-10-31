import type {
  Departement,
  OFS,
  Region,
} from '../../routes/organismes-fonciers-solidaires/definitions';

export const formatOFSs = (OFSs: OFS[]): Region[] => {
  const regions: Region[] = [];

  const regionsList = [...new Set(OFSs.map((ofs) => ofs.region))];

  regionsList.forEach((region) => {
    let totalRegionnalOFSs = 0;
    const regionnalOFSs: OFS[] = OFSs.filter((ofs) => ofs.region === region);

    const departementsNames = [
      ...new Set(regionnalOFSs.map((ofs) => ofs.departements)),
    ]
      .map((departement) => departement.split(', '))
      .flat()
      .filter((departement) => departement.length);

    const departementsNamesList = [...new Set(departementsNames)];

    const departements: Departement[] = [];

    departementsNamesList.forEach((departementName) => {
      const departementalOFSs = regionnalOFSs.filter((ofs) =>
        ofs.departements.includes(departementName),
      );

      departements.push({
        name: departementName,
        OFSs: departementalOFSs,
        totalOFSs: departementalOFSs.length,
      });

      totalRegionnalOFSs += departementalOFSs.length;
    });

    regions.push({ name: region, departements, totalOFSs: totalRegionnalOFSs });
  });

  return regions;
};
