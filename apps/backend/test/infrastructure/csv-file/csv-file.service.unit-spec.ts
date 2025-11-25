import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { CsvFileService } from 'src/infrastructure/csv-file/csv-file.service';
import { Row } from '@fast-csv/format';

describe('CsvFileService', () => {
  let csvFileService: CsvFileService;
  let tempDir: string;
  const headers = ['name', 'age', 'city'];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvFileService],
    }).compile();

    csvFileService = module.get<CsvFileService>(CsvFileService);
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach((file) => {
        fs.unlinkSync(path.join(tempDir, file));
      });
      fs.rmdirSync(tempDir);
    }
  });

  describe('create', () => {
    it('should create a new CSV file with headers and rows', async () => {
      const filePath = path.join(tempDir, 'create-test.csv');
      const rows: Row[] = [
        { name: 'John', age: '30', city: 'Paris' },
        { name: 'Jane', age: '25', city: 'Lyon' },
      ];

      await csvFileService.create(headers, filePath, rows);

      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name,age,city');
      expect(content).toContain('John,30,Paris');
      expect(content).toContain('Jane,25,Lyon');
    });

    it('should overwrite existing file', async () => {
      const filePath = path.join(tempDir, 'overwrite-test.csv');
      const firstRows: Row[] = [{ name: 'First', age: '1', city: 'City1' }];
      const secondRows: Row[] = [{ name: 'Second', age: '2', city: 'City2' }];

      await csvFileService.create(headers, filePath, firstRows);
      await csvFileService.create(headers, filePath, secondRows);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toContain('First,1,City1');
      expect(content).toContain('Second,2,City2');
    });
  });

  describe('append', () => {
    it('should append rows to an existing CSV file without headers', async () => {
      const filePath = path.join(tempDir, 'append-test.csv');
      const initialRows: Row[] = [{ name: 'John', age: '30', city: 'Paris' }];
      const appendedRows: Row[] = [{ name: 'Jane', age: '25', city: 'Lyon' }];

      await csvFileService.create(headers, filePath, initialRows);
      await csvFileService.append(headers, filePath, appendedRows);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim() !== '');
      expect(lines).toHaveLength(3);
      expect(content).toContain('John,30,Paris');
      expect(content).toContain('Jane,25,Lyon');
      expect(content.split('name,age,city').length).toBe(2);
    });

    it('should append multiple rows', async () => {
      const filePath = path.join(tempDir, 'append-multiple-test.csv');
      const initialRows: Row[] = [{ name: 'John', age: '30', city: 'Paris' }];
      const appendedRows: Row[] = [
        { name: 'Jane', age: '25', city: 'Lyon' },
        { name: 'Bob', age: '35', city: 'Marseille' },
      ];

      await csvFileService.create(headers, filePath, initialRows);
      await csvFileService.append(headers, filePath, appendedRows);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('John,30,Paris');
      expect(content).toContain('Jane,25,Lyon');
      expect(content).toContain('Bob,35,Marseille');
    });

    it('should append to a file that does not exist yet', async () => {
      const filePath = path.join(tempDir, 'append-new-test.csv');
      const rows: Row[] = [{ name: 'John', age: '30', city: 'Paris' }];

      await csvFileService.append(headers, filePath, rows);

      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('John,30,Paris');
    });
  });

  describe('read', () => {
    it('should read an existing CSV file', async () => {
      const filePath = path.join(tempDir, 'read-test.csv');
      const rows: Row[] = [
        { name: 'John', age: '30', city: 'Paris' },
        { name: 'Jane', age: '25', city: 'Lyon' },
      ];
      await csvFileService.create(headers, filePath, rows);

      const content = await csvFileService.read(filePath);

      expect(content).toBeInstanceOf(Buffer);
      const contentString = content.toString('utf-8');
      expect(contentString).toContain('name,age,city');
      expect(contentString).toContain('John,30,Paris');
      expect(contentString).toContain('Jane,25,Lyon');
    });

    it('should reject when file does not exist', async () => {
      const filePath = path.join(tempDir, 'non-existent.csv');

      await expect(csvFileService.read(filePath)).rejects.toBeDefined();
    });

    it('should read an empty CSV file', async () => {
      const filePath = path.join(tempDir, 'read-empty-test.csv');
      await csvFileService.create(headers, filePath, []);

      const content = await csvFileService.read(filePath);

      expect(content).toBeInstanceOf(Buffer);
      const contentString = content.toString('utf-8');
      expect(contentString).toBeDefined();
    });
  });

  describe('write', () => {
    it('should write rows to a stream', async () => {
      const filePath = path.join(tempDir, 'write-test.csv');
      const stream = fs.createWriteStream(filePath);
      const rows: Row[] = [
        { name: 'John', age: '30', city: 'Paris' },
        { name: 'Jane', age: '25', city: 'Lyon' },
      ];
      const options = {
        headers,
        includeEndRowDelimiter: true,
      };

      await csvFileService.write(stream, rows, options);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name,age,city');
      expect(content).toContain('John,30,Paris');
      expect(content).toContain('Jane,25,Lyon');
    });
  });

  describe('delete', () => {
    it('should delete an existing CSV file', async () => {
      const filePath = path.join(tempDir, 'delete-test.csv');
      const rows: Row[] = [{ name: 'John', age: '30', city: 'Paris' }];

      await csvFileService.create(headers, filePath, rows);
      expect(fs.existsSync(filePath)).toBe(true);

      await csvFileService.delete(filePath);

      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should reject when file does not exist', async () => {
      const filePath = path.join(tempDir, 'non-existent.csv');

      await expect(csvFileService.delete(filePath)).rejects.toBeDefined();
    });
  });

  describe('integration', () => {
    it('should create, append, and read a CSV file', async () => {
      const filePath = path.join(tempDir, 'integration-test.csv');
      const initialRows: Row[] = [{ name: 'John', age: '30', city: 'Paris' }];
      const appendedRows: Row[] = [{ name: 'Jane', age: '25', city: 'Lyon' }];

      await csvFileService.create(headers, filePath, initialRows);
      await csvFileService.append(headers, filePath, appendedRows);
      const content = await csvFileService.read(filePath);

      const contentString = content.toString('utf-8');
      expect(contentString).toContain('name,age,city');
      expect(contentString).toContain('John,30,Paris');
      expect(contentString).toContain('Jane,25,Lyon');
    });
  });
});
