import { zip } from 'zip-a-folder'
import { Plugin } from 'vite'

export default function pack(): Plugin {
    return {
        name: 'pack',
        apply: 'build',
        enforce: 'post',
        async closeBundle() {
            const target = process.env.TARGET
            await zip('dist', `${target}.zip`)
            console.log(`Packed ${target}.zip`)
        }
    }
}
