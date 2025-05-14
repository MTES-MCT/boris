import { OmitType } from '@nestjs/swagger';
import { DistributorView } from 'src/application/distributor/views/distributor.view';

export class MinimalDistributorView extends OmitType(DistributorView, [
  'ofss',
  'createdAt',
  'updatedAt',
]) {}
