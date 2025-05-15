// import type { OfsView } from '$backend/src/application/ofs/views/ofs.view';
// import type {
//   FormattedCommercialisateurs,
//   OFS,
//   Region,
// } from '$lib/utils/definitions';

// export const formatOFSs = (ofss: OfsView[]): Region[] => {
//   const regions: Region[] = [];

//   const regionNames = [...new Set(ofss.map((ofs) => ofs.regions.flat()))];

//   console.log(regionNames);

//   // regionNames.forEach((regionName) => {
//   //   let totalOFSsInRegion = 0;

//   //   const regionnalOFSs: OFS[] = OFSs.filter((ofs) =>
//   //     ofs.region.includes(regionName),
//   //   ).map((ofs) => {
//   //     const liens = ofs.lien.split(',');
//   //     const noms = ofs.commercialisateur.split(',');

//   //     const formattedCommercialisateurs: FormattedCommercialisateurs[] = [];

//   //     liens.forEach((lien, index) => {
//   //       formattedCommercialisateurs.push({
//   //         lien: lien.replace(/^\s+|\s+$|\s+(?=\s)/g, ''),
//   //         nom: noms[index].replace(/^\s+|\s+$|\s+(?=\s)/g, ''),
//   //       });
//   //     });

//   //     return {
//   //       ...ofs,
//   //       departements: formatDepartements(ofs.departements),
//   //       formattedCommercialisateurs,
//   //     };
//   //   });

//   //   totalOFSsInRegion = regionnalOFSs.length;

//   //   regions.push({
//   //     name: regionName,
//   //     OFSs: regionnalOFSs,
//   //     totalOFSs: totalOFSsInRegion,
//   //   });
//   // });

//   return regions;
// };

// export const formatEuro = (amount: number) => {
//   return new Intl.NumberFormat('fr-FR', {
//     style: 'currency',
//     currency: 'EUR',
//     maximumFractionDigits: 0,
//   })
//     .format(amount)
//     .replace(/\u202f/g, ' ')
//     .replace(/\u00a0/g, ' ');
// };

// export const formatPublishedAt = (date: string) => {
//   const formattedDate = new Intl.DateTimeFormat('fr-FR', {
//     dateStyle: 'long',
//     timeStyle: 'short',
//     timeZone: 'Europe/Paris',
//   }).format(new Date(date));

//   return `Publié le ${formattedDate}`;
// };

// export const formatDepartements = (departements: string) => {
//   if (departements.length === 0) {
//     return '';
//   } else {
//     return departements
//       .split(', ')
//       .map((departement) => `BRS ${departement}`)
//       .join(', ');
//   }
// };
