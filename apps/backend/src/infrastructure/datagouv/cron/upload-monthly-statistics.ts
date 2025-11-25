import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CountSimulationsUsecase } from 'src/application/landbot-customer/usecases/countSimulations.usecase';

import { CsvFileServiceInterface } from 'src/domain/csv-file/csv-file.service.interface';

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
    frequence_monitoring: 'trimestrielle',
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
    @Inject('CsvFileServiceInterface')
    private readonly csvFileService: CsvFileServiceInterface,
    private readonly countSimulationsUsecase: CountSimulationsUsecase,
  ) {}

  @Cron('*/3 * * * * *', { timeZone: 'Europe/Paris' })
  public async execute() {
    const today = new Date();
    const lastMonthLastDay = new Date(today.setDate(0));

    const monthName = lastMonthLastDay.toLocaleString('fr-FR', {
      month: 'long',
    });
    const year = lastMonthLastDay.toLocaleString('fr-FR', { year: 'numeric' });
    const filePath = `${this.filePathPrefix}-${monthName}-${year}.csv`;

    const rows: MonthlyStatisticsRow[] = [];

    const simulationsCountRow = await this.getSimulationsCountRow();
    rows.push(simulationsCountRow);

    await this.csvFileService.create([...headers], filePath, rows);

    // try {
    //   await this.datagouvRepository.uploadCsvFile(
    //     'data.csv',
    //     process.env.DATAGOUV_API_KEY as string,
    //     process.env.DATAGOUV_DATASET_ID as string,
    //   );
    // } catch (error) {
    //   console.error('Error uploading monthly statistics:', error);
    // }
  }

  private async getSimulationsCountRow(): Promise<MonthlyStatisticsRow> {
    const simulationsCount = await this.countSimulationsUsecase.execute();

    return {
      ...this.initialRow,
      valeur: simulationsCount.toString(),
      indicateur: 'Nombre de simulation réalisees',
      commentaires: 'Nombre de simulations réalisées au niveau national',
    };
  }
}
