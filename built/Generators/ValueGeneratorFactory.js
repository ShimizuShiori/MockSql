"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValueGeneratorFactory {
    static RegistGenerator(key, func) {
        ValueGeneratorFactory.map.set(key, func);
    }
    static GetGenerator(key, inject) {
        let result = ValueGeneratorFactory.map.get(key)(key);
        for (var key in inject) {
            result[key] = inject[key];
        }
        return result;
    }
}
ValueGeneratorFactory.map = new Map();
exports.ValueGeneratorFactory = ValueGeneratorFactory;
