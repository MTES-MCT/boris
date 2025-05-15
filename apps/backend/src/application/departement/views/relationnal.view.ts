import { OmitType } from '@nestjs/swagger';
import { DepartementView } from './departement.view';

export class DepartementRelationnalView extends OmitType(DepartementView, []) {}
