import { SearchClient, searchClient } from '@algolia/client-search'
import { Search } from "."
import { algoliaRequester, getLanguage, suggestionsLength } from '../utils'

const avaliableLanguagesIndex = {
    'zh-CN': {
        index: 'zh'
    },
    'en-US': {
        index: 'en'
    },
    'es': {
        index: 'es'
    },
    'fr-FR': {
        index: 'fr'
    }
}

export default class ElementSearch implements Search {
    name = 'Element'
    client: SearchClient
    constructor() {
        this.client = searchClient('4C63BTGP6S', '0729c3c7f4dc8db7395ad0b19c0748d2', {
            requester: algoliaRequester
        })
    }

    async search(query: string) {
        const language = await getLanguage(Object.keys(avaliableLanguagesIndex)) as keyof typeof avaliableLanguagesIndex
        try {
            const { hits } = await this.client.searchSingleIndex<{
                component: string
                title: string
                anchor: string | null
            }>({
                indexName: `element-${avaliableLanguagesIndex[language].index}`,
                searchParams: {
                    query,
                    hitsPerPage: suggestionsLength
                }
            })
            return hits.map((hit, order) => {
                const { component, anchor, title } = hit
                return {
                    content: `https://element.eleme.io/#/${language}/component/${component}${anchor ? `#${anchor}` : ''}`,
                    description: [title, component, this.name].filter(Boolean).join(' | '),
                    order
                }
            })
        } catch (error) {
            console.error('Element search error.', error)
            return []
        }
    }
} 