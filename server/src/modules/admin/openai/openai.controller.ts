import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './providers/openai/openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openApiService: OpenaiService) {}

  @Get('influencers')
  async getInfluencers() {
    return this.openApiService.getInfluencerDetails();
  }
}
