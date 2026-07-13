import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const net = process.env.NETWORK_ENVIRONMENT || 'mainnet';
const out = fileURLToPath(new URL('../src/env.config.js', import.meta.url));

writeFileSync(out, `window.envConfig = {\n  NETWORK_ENVIRONMENT: '${net}'\n};\n`);
console.log(`generate-env-config: wrote ${out} (NETWORK_ENVIRONMENT=${net})`);
