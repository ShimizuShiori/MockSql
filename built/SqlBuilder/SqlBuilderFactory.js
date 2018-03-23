"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SqlBuilderFactory {
    static ResigtSqlBuilder(key, func) {
        SqlBuilderFactory.map.set(key, func);
    }
    static GetSqlBuilder(key) {
        return SqlBuilderFactory.map.get(key)(key);
    }
}
SqlBuilderFactory.map = new Map();
exports.SqlBuilderFactory = SqlBuilderFactory;
