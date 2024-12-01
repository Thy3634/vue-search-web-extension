import browser from "webextension-polyfill"
import { searchClient } from '@algolia/client-search'
import { ofetch } from "ofetch"

export async function getLanguage(availableLanguages: string[]): Promise<string> {
    const { language } = await browser.storage.local.get({
        language: browser.i18n.getUILanguage()
    }) as { language: string }

    if (availableLanguages.includes(language))
        return language

    if (['zh-CN', 'zh-Hans', 'zh', 'zh-SG'].includes(language)) {
        if (availableLanguages.includes('zh-Hans'))
            return 'zh-Hans'
        if (availableLanguages.includes('zh'))
            return 'zh'
        if (availableLanguages.includes('zh-CN'))
            return 'zh-CN'
    }

    if (['zh-TW', 'zh-Hant', 'zh-HK'].includes(language)) {
        if (availableLanguages.includes('zh-Hant'))
            return 'zh-Hant'
        if (availableLanguages.includes('zh-TW'))
            return 'zh-TW'
        if (availableLanguages.includes('zh-HK'))
            return 'zh-HK'
    }

    if (language.includes('-')) {
        const [lang] = language.split('-')
        if (availableLanguages.includes(lang))
            return lang
    }

    return availableLanguages[0]
}

export const browserType = getBrowserType()

function getBrowserType() {
    let userAgent = navigator.userAgent.toLowerCase();
    // The order is matter. Do not change it! 
    // You should know what you are doing.
    if (userAgent.indexOf("edg") !== -1)
        return "edge"
    if (userAgent.indexOf("chrome") !== -1)
        return "chrome"
    if (userAgent.indexOf("safari") !== -1)
        return "safari"
    if (userAgent.indexOf("gecko") !== -1)
        return "firefox"
    return "unknown"
}

export const suggestionsLength = { "firefox": 6, "edge": 7, "chrome": 8, "unknown": 6, 'safari': 6 }[browserType]

export const algoliaRequester: Exclude<Parameters<typeof searchClient>[2], undefined>['requester'] = {
    async send(request) {
        try {
            const response = await ofetch(request.url, {
                method: request.method,
                headers: request.headers,
                timeout: request.connectTimeout + request.responseTimeout,
                body: request.data,
                responseType: 'text',
            })
            return {
                content: response,
                isTimedOut: false,
                status: 200
            }
        } catch (error: any) {
            if (error?.name === 'TimeoutError') {
                return {
                    content: '',
                    isTimedOut: true,
                    status: 408
                }
            }
            return {
                content: '',
                isTimedOut: false,
                status: error?.code
            }
        }


    }
}