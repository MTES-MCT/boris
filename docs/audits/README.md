# Accessibility work — 13 November 2026

## Done

The 13 findings from the initial technical RGAA audit have corresponding local fixes:

- Decorative logos and illustrations are hidden from assistive technologies.
- Statistics charts have accessible names and expandable HTML data tables.
- Map markers have names and keyboard activation; result counts are announced. Switching between map and list cleans up the previous map.
- City suggestions use valid ARIA positions and relationships. Stale suggestions are cleared, and selecting with Enter does not submit the form.
- Personal details have appropriate autocomplete attributes and an email input type. Form messages and table rows have unique IDs.
- Data tables have captions and explicit column/row headers where needed.
- A human-readable sitemap is linked from the footer; the acquisition simulator is included in the XML sitemap.
- OFS availability statuses remain readable without CSS. Video frame titles and the housing search heading hierarchy are corrected.

ARA was updated using the corrected local version, keeping the existing seven-page sample: **314 evaluations recorded — 91 conforming and 223 not applicable**. Its **42% completion indicator is not a compliance rate**. Unverified criteria remain unevaluated.

## Verified

- Svelte/TypeScript check: no errors or warnings.
- Existing unit tests: **71 passed**.
- Dedicated browser suite: **9 scenarios passed**, including automated checks across **38 pages** and targeted keyboard/form tests.
- Desktop and mobile visual checks of the new data tables and sitemap.

The browser suite uses fictitious data and an isolated local backend. Run it with:

```sh
npm run check -w @boris/frontend
npm run test:unit -w @boris/frontend -- --run
npm run test:e2e:rgaa -w @boris/frontend
```

ESLint remains blocked by a pre-existing configuration error: `defineConfig` is imported from `@eslint/js`.

## Remaining

- Merge and deploy the fixes, then verify them with real application data.
- Test screen-reader output, focus management and complete keyboard journeys, including all conditional simulator steps and error states.
- Complete manual contrast, browser zoom, reflow and text-spacing checks across interactive states.
- Audit downloadable PDFs and third-party video players. Transcripts and reviewed subtitles were explicitly excluded from this implementation; their accessibility remains unresolved.
- Complete the remaining applicable RGAA tests and ARA entries before calculating a compliance rate or updating the accessibility declaration.

These changes address the recorded technical findings; they do not establish full RGAA compliance.
