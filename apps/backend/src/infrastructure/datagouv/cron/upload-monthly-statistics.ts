import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CountSimulationsUsecase } from 'src/application/landbot-customer/usecases/countSimulations.usecase';
import { GroupByRegionsUsecase } from 'src/application/landbot-customer/usecases/groupByRegions.usecase';
import { CsvFileServiceInterface } from 'src/domain/csv-file/csv-file.service.interface';
import { DatagouvRepositoryInterface } from 'src/domain/datagouv/datagouv.repository.interface';

const headers = [
  'administration_rattachement',
  'nom_service_public_numerique',
  'indicateur',
  'type_indicateur',
  'valeur',
  'unite_mesure',
  'est_cible',
  'frequence_monitoring',
  'date',
  'est_periode',
  'date_debut',
  'est_automatise',
  'source_collecte',
  'denom_insee',
  'code_insee',
  'dataviz_wish',
  'commentaires',
] as const;

type MonthlyStatisticsRow = {
  [K in (typeof headers)[number]]: string;
};

@Injectable()
export class UploadMonthlyStatisticsCron {
  private readonly filePathPrefix = 'statistiques-impact-BoRiS';
  private readonly initialRow: MonthlyStatisticsRow = {
    administration_rattachement: 'DGALN',
    nom_service_public_numerique: 'BoRiS',
    indicateur: '',
    type_indicateur: 'impact',
    valeur: '',
    unite_mesure: 'unité',
    est_cible: 'FALSE',
    frequence_monitoring: 'mensuelle',
    date: '',
    est_periode: 'TRUE',
    date_debut: '',
    est_automatise: 'TRUE',
    source_collecte: 'script',
    denom_insee: '',
    code_insee: '',
    dataviz_wish: '',
    commentaires: '',
  };

  constructor(
    @Inject('DatagouvRepositoryInterface')
    private readonly datagouvRepository: DatagouvRepositoryInterface,
    @Inject('CsvFileServiceInterface')
    private readonly csvFileService: CsvFileServiceInterface,
    private readonly countSimulationsUsecase: CountSimulationsUsecase,
    private readonly groupByRegionsUsecase: GroupByRegionsUsecase,
  ) {}

  @Cron('0 3 2 * *', { timeZone: 'Europe/Paris' })
  public async execute() {
    const filePath = `${this.filePathPrefix}-${this.getLastMonth().monthName}-${this.getLastMonth().year}.csv`;

    const rows: MonthlyStatisticsRow[] = [];

    const simulationsCountRow = await this.getSimulationsCountRow();
    rows.push(simulationsCountRow);

    const regionsCountRows = await this.getRegionsCountRow();
    rows.push(...regionsCountRows);

    await this.csvFileService.create([...headers], filePath, rows);

    try {
      await this.datagouvRepository.uploadCsvFile(
        filePath,
        process.env.DATAGOUV_API_KEY as string,
        process.env.DATAGOUV_DATASET_ID as string,
      );

      await this.csvFileService.delete(filePath);
    } catch (error) {
      console.error('Error uploading monthly statistics:', error);
    }
  }

  private async getSimulationsCountRow(): Promise<MonthlyStatisticsRow> {
    const simulationsCount = await this.countSimulationsUsecase.execute({
      year: this.getLastMonth().year,
      month: this.getLastMonth().month,
    });

    return {
      ...this.initialRow,
      valeur: simulationsCount.toString(),
      indicateur: 'Nombre de simulation réalisées',
      date: `${this.getToday().year}-${this.getToday().month}-01`,
      date_debut: `${this.getLastMonth().year}-${this.getLastMonth().month}-01`,
      commentaires: 'Nombre de simulations réalisées au niveau national',
    };
  }

  private async getRegionsCountRow(): Promise<MonthlyStatisticsRow[]> {
    const regionsCountRows = await this.groupByRegionsUsecase.execute({
      year: this.getLastMonth().year,
      month: this.getLastMonth().month,
    });

    return regionsCountRows.data
      .map((regionRow) => ({
        ...this.initialRow,
        valeur: regionRow.count,
        indicateur:
          'Nombre de ménages mis en relation avec un OFS ou son commercialisateur',
        date: `${this.getToday().year}-${this.getToday().month}-01`,
        date_debut: `${this.getLastMonth().year}-${this.getLastMonth().month}-01`,
        denom_insee: 'REG',
        code_insee: regionRow.regionCode,
        dataviz_wish: 'map',
        commentaires: `Nombre de ménages qui ont laissé leur coordonnées et qui on été mis en relation avec les OFS ou leur commercialisateurs dans une région`,
      }))
      .sort((a, b) => a.code_insee.localeCompare(b.code_insee));
  }

  private getLastMonth(): { year: number; month: number; monthName: string } {
    const today = new Date();
    today.setDate(0);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const monthName = today.toLocaleString('fr-FR', { month: 'long' });

    return { year, month, monthName };
  }

  private getToday(): { year: number; month: number } {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    return { year, month };
  }
}
