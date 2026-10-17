declare module "node:sqlite" {
  export interface RunResult {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    all(...anonymousParameters: unknown[]): Array<Record<string, unknown>>;
    get(...anonymousParameters: unknown[]): Record<string, unknown> | undefined;
    run(...anonymousParameters: unknown[]): RunResult;
  }

  export class DatabaseSync {
    constructor(location: string);
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }

  export function backup(sourceDb: DatabaseSync, path: string): Promise<void>;
}
