// @ts-expect-error: no module
import Papa from 'papaparse';
import { formatOFSs } from '$lib/utils/formatters';
import { BORIS_CMS_URL } from '$env/static/private';

export const load = async () => {
  const response = await fetch(`${BORIS_CMS_URL}/api/v2/documents`);
  const data = await response.json();

  const document = data.items[0];
  const csvFile = await fetch(document.meta.download_url);
  const csvFileContent = await csvFile.text();

  const OFSs = await Papa.parse(csvFileContent, { header: true });

  const regions = formatOFSs(OFSs.data);

  return {
    regions,
  };
};
