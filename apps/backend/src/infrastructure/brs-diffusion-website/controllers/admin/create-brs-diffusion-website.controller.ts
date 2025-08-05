import { Controller } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('/brs-diffusion-websites')
export class CreateBrsDiffusionWebsiteAdminController {
  constructor() {}

  public async createBrsDiffusionWebsite() {}
}
