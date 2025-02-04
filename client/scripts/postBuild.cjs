/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs-extra');
const glob = require('glob-promise');
const cheerio = require('cheerio');

async function transformHtml() {
  try {
    const svelteKitFiles = await glob('./.svelte-kit/output/**/*.html', {});
    const buildFiles = await glob('./build/**/*.html', {});

    const files = [...svelteKitFiles, ...buildFiles];

    for await (let file of files) {
      try {
        const buffer = fs.readFileSync(file);
        const $ = cheerio.loadBuffer(buffer);

        const body = $('body');

        $('link[rel="modulepreload"]').each((i, element) => {
          const $this = $(element);
          const src = $this.attr('href');
          $(`<script type="module" async src="${src}"></script>`).appendTo(
            body,
          );

          $this.remove();
        });

        console.log($.html());

        await fs.outputFile(file, $.html());
      } catch (error) {
        console.error(error);
      }
    }

    console.log(`${files.length} HTML files transformed successfully.`);
  } catch (error) {
    console.error(error);
  }
}

transformHtml();
