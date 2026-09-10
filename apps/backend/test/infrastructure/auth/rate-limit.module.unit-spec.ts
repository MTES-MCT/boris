import { MODULE_METADATA } from '@nestjs/common/constants';
import { AcquisitionSimulationModule } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.module';
import { RateLimitModule } from 'src/infrastructure/auth/rate-limit.module';
import { BrsDiffusionWebsiteModule } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.module';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { EligibilitySimulationModule } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.module';
import { MunicipalityModule } from 'src/infrastructure/municipality/municipality.module';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { RegionModule } from 'src/infrastructure/region/region.module';

describe('RateLimitModule wiring', () => {
  it.each([
    AcquisitionSimulationModule,
    BrsDiffusionWebsiteModule,
    DepartementModule,
    EligibilitySimulationModule,
    MunicipalityModule,
    OfsModule,
    RegionModule,
  ])('%s imports the rate-limit providers used by ApiKeyGuard', (module) => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) as
      | unknown[]
      | undefined;

    expect(imports).toContain(RateLimitModule);
  });
});
