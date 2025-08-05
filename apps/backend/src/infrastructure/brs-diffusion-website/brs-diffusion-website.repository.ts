import { Injectable } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';

@Injectable()
export class BrsDiffusionWebsiteRepository
  implements BrsDiffusionWebsiteRepositoryInterface
{
  constructor(
    @InjectRepository(BrsDiffusionWebsiteEntity)
    private readonly repository: Repository<BrsDiffusionWebsiteEntity>,
  ) {}

  public save(
    brsDiffusionWebsite: BrsDiffusionWebsiteEntity,
  ): Promise<BrsDiffusionWebsiteEntity> {
    return this.repository.save(brsDiffusionWebsite);
  }
}
