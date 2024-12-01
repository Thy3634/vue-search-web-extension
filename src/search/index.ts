import type Browser from "webextension-polyfill"
import VueSearch from "./vue"
import VueRouterSearch from "./vue-router"
import PiniaSearch from "./pinia"
import VueUseSearch from "./vueuse"
import VuetifySearch from "./vuetify"
import ElementPlusSearch from "./elememt-plus"
import Nuxt2Search from "./nuxt2"
import ElementSearch from "./elememt"

export {
    VueSearch,
    VueRouterSearch,
    PiniaSearch,
    VueUseSearch,
    VuetifySearch,
    ElementPlusSearch,
    Nuxt2Search,
    ElementSearch,
}

export declare abstract class Search {
    readonly name: string
    constructor(name: string)

    abstract search(query: string): Promise<SuggestResult[]>;
}

interface SuggestResult extends Browser.Omnibox.SuggestResult {
    order?: number
}

