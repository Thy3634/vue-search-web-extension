import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import webExtension, { readJsonFile } from "vite-plugin-web-extension"
import pack from './pack'

const manifest = readJsonFile("src/manifest.json")
const pkg = readJsonFile("package.json")

function generateManifest() {
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // @ts-ignore
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
      browser: process.env.TARGET,
    }),
    pack(),
  ],
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __DESCRIPTION__: JSON.stringify(pkg.description),
    __BUGS_URL__: JSON.stringify(pkg.bugs.url),
  },
})
