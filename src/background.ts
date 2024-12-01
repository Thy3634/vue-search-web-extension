import browser from "webextension-polyfill"
import { VueSearch, VueRouterSearch, PiniaSearch, VueUseSearch, VuetifySearch, ElementPlusSearch, Nuxt2Search, ElementSearch } from "./search"

browser.action?.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})

const vueSearch = new VueSearch()
const vueRouterSearch = new VueRouterSearch()
const piniaSearch = new PiniaSearch()
const vueUseSearch = new VueUseSearch()
const vuetifySearch = new VuetifySearch()
const elementPlusSearch = new ElementPlusSearch()
const nuxt2Search = new Nuxt2Search()
const elementSearch = new ElementSearch()

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  if (text.startsWith('router:')) {
    vueRouterSearch.search(text.slice(7)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('pinia:')) {
    piniaSearch.search(text.slice(6)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('use:')) {
    vueUseSearch.search(text.slice(4)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('vuetify:')) {
    vuetifySearch.search(text.slice(8)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('element-plus:')) {
    elementPlusSearch.search(text.slice(13)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('nuxt2:')) {
    nuxt2Search.search(text.slice(6)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else if (text.startsWith('element:')) {
    elementSearch.search(text.slice(8)).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
  else {
    vueSearch.search(text).then((suggestions) => {
      suggest(suggestions.map(({ content, description }) => ({ content, description })))
    })
  }
})

browser.omnibox.onInputEntered.addListener((url, disposition) => {
  switch (disposition) {
    case "currentTab":
      browser.tabs.update({ url })
      break
    case "newForegroundTab":
      browser.tabs.create({ url })
      break
    case "newBackgroundTab":
      browser.tabs.create({ url, active: false })
      break
  }
})

browser.runtime.setUninstallURL(__BUGS_URL__)
