'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const node_server_1 = require('../../../../dist/app');
let IndexController = class IndexController {
    hello(ctx, next) {
        ctx.body = 'Hello world';
    }
    hello2(ctx, next) {
        ctx.body = 'Hello world';
    }
};
tslib_1.__decorate(
    [
        node_server_1.HttpGet('/'),
        tslib_1.__metadata('design:type', Function),
        tslib_1.__metadata('design:paramtypes', [Object, Object]),
        tslib_1.__metadata('design:returntype', void 0),
    ],
    IndexController.prototype,
    'hello',
    null
);
tslib_1.__decorate(
    [
        node_server_1.HttpGet('/2'),
        tslib_1.__metadata('design:type', Function),
        tslib_1.__metadata('design:paramtypes', [Object, Object]),
        tslib_1.__metadata('design:returntype', void 0),
    ],
    IndexController.prototype,
    'hello2',
    null
);
IndexController = tslib_1.__decorate(
    [node_server_1.Controller('/')],
    IndexController
);
exports.default = IndexController;
//# sourceMappingURL=index.controller.js.map
