import type { Region } from '$lib/utils/definitions';
import type { OfsView } from '$lib/utils/api-types';

export const formatOfss = (ofss: OfsView[]): Region[] => {
  const regionNames = [
    ...new Set(
      ofss.map((ofs) => ofs.regions.map((region) => region.name).flat()).flat(),
    ),
  ];

  const regions: Region[] = [];

  regionNames.forEach((regionName) => {
    let totalOfssInRegion = 0;

    const regionnalOfss: OfsView[] = ofss.filter((ofs) =>
      ofs.regions.some((region) => region.name === regionName),
    );

    totalOfssInRegion = regionnalOfss.length;

    regions.push({
      name: regionName,
      ofss: regionnalOfss,
      totalOfss: totalOfssInRegion,
    });
  });

  return regions;
};

export const formatEuro = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\u202f/g, ' ')
    .replace(/\u00a0/g, ' ');
};

export const formatPublishedAt = (date: string) => {
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(date));

  return `Publié le ${formattedDate}`;
};
