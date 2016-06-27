import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import string from 'rollup-plugin-string';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
// import filesize from 'rollup-plugin-filesize';
// rollup-plugin-alias
// rollup-plugin-image (base64 encoded- SMALL FILES ONLY!)
// modular-css/rollup

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

export default {
    entry: 'src/main.js',
    plugins: [
        // node require system / core API configuration
        builtins(),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs({
            ignoreGlobal: true,
            include: 'node_modules/**',
            exclude: 'node_modules/rollup-plugin-node-globals/**',
        }),
        globals(),
        json(),

        // ESnext
        buble({
            include: ['src/**'],
        }),

        // Extended include types
        string({
            include: '**/*.md',
        }),

        // Misc
        // filesize(),  // :NOTE: breaks sourcemaps!
    ],
    external: [], //external,
    targets: [
        {
            dest: pkg['main'],
            format: 'cjs',
            intro: '(function() {', // :NOTE: need to wrap in IIFE 'cos buble doesn't and some libs use window globals as vars
            outro: '}())',
            sourceMap: true,
        },
    ],
};
