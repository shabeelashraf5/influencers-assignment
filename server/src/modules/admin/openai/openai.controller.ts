import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Get('dashboard')
  public async userDetails() {
    const response = await this.openApiService.displayInfluncers();
    return response;
  }

  @Delete('delete/:id/influencers')
  async userDisplayFolder(@Param('id') id: string) {
    const response = await this.openApiService.deleteInfluncers(id);
    return response;
  }

  @Get('/:id/page')
  async getFolderFiles(@Param('id') influId: string) {
    console.log('Folder ID:', influId);
    return await this.openApiService.showInfluncers(influId);
  }
}
