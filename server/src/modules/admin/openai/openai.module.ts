import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './providers/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Influencer, InfluencerSchema } from './schemas/openai.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
