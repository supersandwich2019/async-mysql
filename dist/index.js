"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let pool = null;
class Database {
    constructor(conn) {
        this.conn = conn;
    }
    rawQuery(sql, args) {
        return this.conn.query(sql, args);
    }
    async stepQuery(sql, args, stepCallback, fieldsCallback) {
        await new Promise((resolve, reject) => {
            const query = this.conn.query(sql, args);
            query.on('error', (err) => {
                reject(err);
            });
            if (fieldsCallback != null) {
                query.on('fields', fieldsCallback);
            }
            query.on('result', stepCallback);
            query.on('end', () => {
                resolve();
            });
        });
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, args, (err, data) => {
                if (!err) {
                    resolve(data);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.conn.beginTransaction((err) => {
                if (!err) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    commit() {
        return new Promise((resolve, reject) => {
            this.conn.commit((err) => {
                if (err == null) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    rollback() {
        return new Promise((resolve, reject) => {
            this.conn.rollback((err) => {
                if (err == null) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    release() {
        this.conn.release();
    }
    static startup(pool_) {
        pool = pool_;
    }
    static getStore(type = Database) {
        if (pool == null) {
            throw new Error(`Database connection pool is not running`);
        }
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err == null) {
                    resolve(new type(conn));
                }
                else {
                    reject(err);
                }
            });
        });
    }
}
exports.Database = Database;
exports.default = Database;
