import { Module } from '@nestjs/common';
import { GeocoderService } from './geocoder.service';

@Module({
  providers: [
    {
      provide: 'GeocoderServiceInterface',
      useClass: GeocoderService,
    },
  ],
  exports: ['GeocoderServiceInterface'],
})
export class GeocoderModule {}
