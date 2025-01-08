import type {
  // ---------------------------------------
  // TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
  // ---------------------------------------
  // Departement,
  // ---------------------------------------
  OFS,
  Region,
} from '$routes/organismes-fonciers-solidaires/definitions';

export const formatOFSs = (OFSs: OFS[]): Region[] => {
  const regions: Region[] = [];

  const regionNames = [
    ...new Set(OFSs.map((ofs) => ofs.region.split(', ')).flat()),
  ];

  regionNames.forEach((regionName) => {
    let totalOFSsInRegion = 0;

    // ---------------------------------------
    // TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
    // ---------------------------------------
    // const departements: Departement[] = [];
    // ---------------------------------------

    const regionnalOFSs: OFS[] = OFSs.filter((ofs) =>
      ofs.region.includes(regionName),
    );

    // ---------------------------------------
    // -- TEMPORAIRE À SUPPRIMER QUAND NOUS AURONS TOUS LES DÉPARTEMENTS.
    // ---------------------------------------
    totalOFSsInRegion = regionnalOFSs.length;

    regions.push({
      name: regionName,
      OFSs: regionnalOFSs,
      totalOFSs: totalOFSsInRegion,
    });
    // ---------------------------------------
    //

    // ---------------------------------------
    // TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
    // ---------------------------------------
    // let departementsNames = [
    //   ...new Set(regionnalOFSs.map((ofs) => ofs.departements.split(', '))),
    // ]
    //   .flat()
    //   .filter((departement) => departement.length);

    // departementsNames = [...new Set(departementsNames)];

    // departementsNames.forEach((departementName) => {
    //   const departementalOFSs = regionnalOFSs.filter((ofs) =>
    //     ofs.departements.includes(departementName),
    //   );

    //   departements.push({
    //     name: departementName,
    //     OFSs: departementalOFSs,
    //     totalOFSs: departementalOFSs.length,
    //   });

    //   totalOFSsInRegion += departementalOFSs.length;
    // });

    // regions.push({
    //   name: regionName,
    //   departements,
    //   totalOFSs: totalOFSsInRegion,
    // });
    // ---------------------------------------
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
  }).format(new Date(date));

  return `Publié le ${formattedDate}`;
};
