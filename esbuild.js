import { build } from 'esbuild';
import { readFileSync } from 'fs';

const uiHtml = readFileSync('src/ui/ui.html', 'utf8');

build({
    entryPoints: ['src/code.ts'],
    bundle: true,
    outfile: 'build/code.js',
    platform: 'node',
    format: 'cjs',
    target: ['es6'],  // 👈 Defina o target diretamente
    define: {
        __html__: JSON.stringify(uiHtml),
    },
    logLevel: 'info',
}).catch(() => process.exit(1));
