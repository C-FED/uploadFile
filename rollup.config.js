import pkg from './package.json';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser'; // minify es6
import babel from 'rollup-plugin-babel';
import extensions from 'rollup-plugin-extensions';

export default {
    input: "./src/index.js",
    output: {
        file: pkg.main,
        format: "iife",
    },
    plugins: [
        json(),
        extensions({
            // Supporting Typescript files
            // Uses ".mjs, .js" by default
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            // Resolves index dir files based on supplied extensions
            // This is enable by default
            resolveIndex: true,
        }),
        babel(),
        terser(), // 压缩文件
    ],
    external: [
        "jQuery",
        "$"
    ],
}