import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './providers/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Influencer, InfluencerSchema } from './schemas/openai.schema';
import { TwitterService } from '../twitter/providers/twitter/twitter.service';
import { TwitterModule } from '../twitter/twitter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
    TwitterModule,
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService, TwitterService],
})
export class OpenaiModule {}
