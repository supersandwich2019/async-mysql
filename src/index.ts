
import { Pool, PoolConnection, Query } from 'mysql';

let pool: Pool | null = null;

export class Database {
  constructor(
    public conn: PoolConnection
  ) {
  }

  rawQuery(sql: string, args: any): Query {
    return this.conn.query(sql, args);
  }

  async stepQuery(sql: string, args: any,
    stepCallback: (row: any, index: number) => void,
    fieldsCallback?: (row: any, index: number) => void) {

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

  query(sql: string, args: any) {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, args, (err: any, data: any) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }

  beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.beginTransaction((err: any) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.commit((err) => {
        if (err == null) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.rollback((err) => {
        if (err == null) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  release() {
    this.conn.release();
  }

  static startup(pool_: Pool) {
    pool = pool_;
  }

  static getStore(type: any = Database): Promise<Database> {
    if (pool == null) {
      throw new Error(`Database connection pool is not running`);
    }
    return new Promise((resolve, reject) => {
      pool!.getConnection((err, conn) => {
        if (err == null) {
          resolve(new type(conn));
        } else {
          reject(err);
        }
      });
    });
  }
}

export default Database;