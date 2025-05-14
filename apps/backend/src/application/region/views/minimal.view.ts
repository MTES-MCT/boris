import { OmitType } from '@nestjs/swagger';
import { RegionView } from './region.view';

export class MinimalRegionView extends OmitType(RegionView, [
  'departements',
  'createdAt',
  'updatedAt',
]) {}
