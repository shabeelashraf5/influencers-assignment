import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenaiService } from './providers/openai/openai.service';
import { createInfluencersDto } from './dtos/openai.dto';

@Controller('api')
export class OpenaiController {
  constructor(private readonly openApiService: OpenaiService) {}

  @Get('leaderboard')
  async getInfluencers() {
    return this.openApiService.getInfluencerDetails();
  }

  @Post('influencers')
  async createInfluencer(@Body() createInfluencerDto: createInfluencersDto) {
    console.log(createInfluencerDto);
    return this.openApiService.fetchInfluencerDetails(createInfluencerDto.name);
  }
}
