// @ts-expect-error: no module
import Papa from 'papaparse';

export const load = async () => {
  const response = await fetch(
    'https://boris-cms-test.osc-fr1.scalingo.io/api/v2/documents?title=liste-ofs',
  );
  const data = await response.json();
  const document = data.items[0];

  const csvFile = await fetch(document.meta.download_url);
  const csvFileContent = await csvFile.text();

  const ofsList = await Papa.parse(csvFileContent, { header: true });

  return {
    ofsList: ofsList.data,
  };
};
