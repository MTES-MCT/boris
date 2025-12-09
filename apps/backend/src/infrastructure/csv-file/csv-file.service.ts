import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';
import { CsvFileServiceInterface } from 'src/domain/csv-file/csv-file.service.interface';

@Injectable()
export class CsvFileService implements CsvFileServiceInterface {
  constructor() {}

  public async write(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: { headers: string[]; includeEndRowDelimiter: boolean },
  ): Promise<void> {
    const writeOpts: FormatterOptionsArgs<Row, Row> = {
      ...options,
    };

    return this.writeToFile(stream, rows, writeOpts);
  }

  public async create(
    headers: string[],
    path: string,
    rows: Row[],
  ): Promise<void> {
    const writeOpts: FormatterOptionsArgs<Row, Row> = {
      headers,
      includeEndRowDelimiter: true,
    };

    return this.writeToFile(fs.createWriteStream(path), rows, writeOpts);
  }

  public async append(
    headers: string[],
    path: string,
    rows: Row[],
  ): Promise<void> {
    const writeOpts: FormatterOptionsArgs<Row, Row> = {
      headers,
      includeEndRowDelimiter: true,
      writeHeaders: false,
    };

    return this.writeToFile(
      fs.createWriteStream(path, { flags: 'a' }),
      rows,
      writeOpts,
    );
  }

  public async read(path: string): Promise<Buffer> {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, contents) => {
        if (err) {
          return rej(err);
        }
        return res(contents);
      });
    });
  }

  public async delete(path: string): Promise<void> {
    return new Promise((res, rej) => {
      fs.unlink(path, (err) => {
        if (err) {
          return rej(err);
        }
        return res();
      });
    });
  }

  private async writeToFile(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: FormatterOptionsArgs<Row, Row>,
  ): Promise<void> {
    return new Promise((res, rej) => {
      writeToStream(stream, rows, options)
        .on('error', (err: Error) => rej(err))
        .on('finish', () => res());
    });
  }
}
