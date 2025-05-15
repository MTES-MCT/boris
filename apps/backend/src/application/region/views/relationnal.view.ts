import { OmitType } from '@nestjs/swagger';
import { RegionView } from './region.view';

export class RegionRelationnalView extends OmitType(RegionView, []) {}
