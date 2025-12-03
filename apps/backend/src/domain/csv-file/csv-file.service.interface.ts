import { Row } from '@fast-csv/format';

export interface CsvFileServiceInterface {
  write(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: { headers: string[]; includeEndRowDelimiter: boolean },
  ): Promise<void>;
  create(headers: string[], path: string, rows: Row[]): Promise<void>;
  append(headers: string[], path: string, rows: Row[]): Promise<void>;
  read(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
}
