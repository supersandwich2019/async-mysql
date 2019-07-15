import { Pool, PoolConnection, Query } from 'mysql';
export declare class Database {
    conn: PoolConnection;
    constructor(conn: PoolConnection);
    rawQuery(sql: string, args: any): Query;
    stepQuery(sql: string, args: any, stepCallback: (row: any, index: number) => void, fieldsCallback?: (row: any, index: number) => void): Promise<void>;
    query(sql: string, args: any): Promise<{}>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    release(): void;
    static startup(pool_: Pool): void;
    static getStore(type?: any): Promise<Database>;
}
export default Database;
