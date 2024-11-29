import browser from "webextension-polyfill";

import { searchClient } from '@algolia/client-search';

const client = searchClient('ML0LEBN7FQ', '21cf9df0734770a2448a9da64a700c22', {
  baseQueryParameters: {
    searchParameters: {
      facetFilters: ['version:v3']
    }
  }
});

// browser.omnibox.

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});
