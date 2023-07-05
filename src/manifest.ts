import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  version: '1.0',
  manifest_version: 3,
  name: 'Prismic Extension',
  permissions: ['tabs', 'activeTab', 'storage', 'scripting'],
  action: {
    default_popup: 'index.html',
  },
  background: {
    type: 'module',
    service_worker: 'scripts/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://*.prismic.io/*'],
      js: ['scripts/content.ts'],
    },
  ],
}

export default manifest
