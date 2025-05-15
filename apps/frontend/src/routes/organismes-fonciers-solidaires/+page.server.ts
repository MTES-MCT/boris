// import { formatOFSs } from '$lib/utils/formatters';
// import { API_URL } from '$env/static/private';
// import type { Region } from '$lib/utils/definitions';
// import { Pagination } from '$backend/src/application/pagination/pagination';
// import { OfsView } from '$backend/src/application/ofs/views/ofs.view';

export const load = async () => {
  // console.log(test);
  // console.log()

  // const response = await fetch(`${API_URL}/ofss`);
  // const ofss: Pagination<OfsView> = await response.json();

  // console.log(ofss);

  // formatOFSs(ofss.items);

  // const response = await fetch(`${PUBLIC_BORIS_CMS_URL}/api/v2/documents`);
  // const data = await response.json();

  // const document = data.items[0];
  // const csvFile = await fetch(document.meta.download_url);
  // const csvFileContent = await csvFile.text();

  // const regions: Region[] = formatOFSs(OFSs.data);

  // return {
  //   regions,
  // };

  return {
    regions: [],
  };
};

export const prerender = false;
