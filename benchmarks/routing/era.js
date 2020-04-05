'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
require('reflect-metadata');
const node_server_1 = tslib_1.__importDefault(require('../../dist/app'));
const app = new node_server_1.default();

let n = parseInt(process.env.MW || '1', 10);

console.log(`  ${n} endpoints - Era`);

app.run({
    port: 8080,
});
