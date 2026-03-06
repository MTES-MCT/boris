import { MunicipalityEntity } from 'src/infrastructure/municipality/municipality.entity';

export interface MunicipalityRepositoryInterface {
  save(municipality: MunicipalityEntity): Promise<MunicipalityEntity>;
  findOneByInseeCode(inseeCode: string): Promise<MunicipalityEntity | null>;
  findOneByDepartementCode(departementCode: string): Promise<MunicipalityEntity | null>;
}
