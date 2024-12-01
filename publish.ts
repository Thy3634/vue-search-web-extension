import { createFetch, ofetch } from "ofetch"
import { readFile } from "fs/promises"
import { config } from '@dotenvx/dotenvx'

config()

async function publishToMicrosoftAddOns() {
    const msFetch = createFetch({
        defaults: {
            baseURL: 'https://api.addons.microsoftedge.microsoft.com',
            headers: {
                Authorization: `ApiKey ${process.env.MICROSOFT_APIKEY}`,
                'X-ClientID': process.env.MICROSOFT_CLIENTID
            }
        }
    })
    const productID = process.env.MICROSOFT_PRODUCTID
    msFetch(`/v1/products/${productID}/submissions/draft/package`, {
        method: 'POST',
        body: await readFile('extension.zip'),
        headers: {
            'Content-Type': 'application/zip'
        },
        async onResponse({ response }) {
            const operationID = response.headers.get('Location')

            if (operationID) {
                await checkUploadStatus(operationID)
                console.log('Upload succeeded')

            } else {
                console.error('Upload failed')
            }

        }
    })

    async function checkUploadStatus(operationID: string) {
        return new Promise<void>(async (resolve, reject) => {
            const response = await msFetch(`/v1/products/${productID}/submissions/draft/package/operations/${operationID}`)
            if (response.status === 'Succeeded') {
                resolve(response)
            } else if (response.status === 'Failed') {
                reject(response)
            } else {
                setTimeout(() => checkUploadStatus(operationID), 2000)
            }
        })
    }

    function publish() {
        msFetch(`/v1/products/${productID}/submissions`, {
            method: 'POST',
            body: {
                notes: 'Publishing new version'
            }
        })
    }
}



declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MICROSOFT_PRODUCTID: string
            MICROSOFT_CLIENTID: string
            MICROSOFT_APIKEY: string
        }
    }
}