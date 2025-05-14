import { OmitType } from '@nestjs/swagger';
import { DepartementView } from './departement.view';

export class MinimalDepartementView extends OmitType(DepartementView, [
  'region',
  'createdAt',
  'updatedAt',
]) {}
