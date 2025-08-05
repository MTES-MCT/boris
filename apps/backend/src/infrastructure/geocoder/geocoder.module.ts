import { Module } from '@nestjs/common';
import { GeocoderService } from './geocoder.service';

@Module({
  providers: [GeocoderService],
  exports: [GeocoderService],
})
export class GeocoderModule {}
