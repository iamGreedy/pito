"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypioInteger = exports.TypioRegex = void 0;
function TypioRegex(pattern) {
    return Object.assign({
        $symbol: 'TypioRegex',
        $wrap(raw) {
            return raw;
        },
        $unwrap(raw) {
            return raw;
        },
        type: 'string',
        pattern,
    }, {});
}
exports.TypioRegex = TypioRegex;
function TypioInteger(option) {
    return Object.assign({
        $symbol: 'TypioInteger',
        $wrap(raw) {
            return raw;
        },
        $unwrap(raw) {
            return raw;
        },
        type: 'integer',
    }, option ?? {});
}
exports.TypioInteger = TypioInteger;
//# sourceMappingURL=std-primitives.js.map