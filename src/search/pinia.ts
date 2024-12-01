import { SearchClient, searchClient } from '@algolia/client-search'
import { Search } from "."
import { algoliaRequester, suggestionsLength } from '../utils'

export default class PiniaSearch implements Search {
    name = 'Pinia'
    client: SearchClient
    constructor() {
        this.client = searchClient('69Y3N7LHI2', '45441f4b65a2f80329fd45c7cb371fea', {
            requester: algoliaRequester
        })
    }

    async search(query: string) {
        try {
            const { hits } = await this.client.searchSingleIndex<{
                url: string
                hierarchy: {
                    lvl0: string
                    lvl1: string | null
                    lvl2: string | null
                    lvl3: string | null
                    lvl4: string | null
                    lvl5: string | null
                    lvl6: string | null
                }
            }>({
                indexName: 'pinia',
                searchParams: {
                    query,
                    hitsPerPage: suggestionsLength
                }
            })
            return hits.map((hit, order) => {
                const { lvl0, lvl1, lvl2, lvl3, lvl4, lvl5, lvl6 } = hit.hierarchy
                return {
                    content: hit.url,
                    description: [lvl6, lvl5, lvl4, lvl3, lvl2, lvl1, lvl0, this.name].filter(Boolean).join(' | '),
                    order
                }
            })
        } catch (error) {
            console.error('Pinia search error', error)
            return []
        }
    }
} 