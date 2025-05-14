import { OmitType } from '@nestjs/swagger';

import { DistributorView } from 'src/application/distributor/views/distributor.view';
export class Distributor extends OmitType(DistributorView, [
  'ofss',
  'createdAt',
  'updatedAt',
]) {}
