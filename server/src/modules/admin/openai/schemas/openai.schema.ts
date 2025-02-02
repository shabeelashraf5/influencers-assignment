import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Claim {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  publishedAt: number; // Timestamp or the date when the claim was published
}

@Schema()
export class Influencer extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [String], required: true })
  category: string[];

  @Prop({ type: String, required: true })
  trustScore: string;

  @Prop({ type: String, required: true })
  trend: string;

  @Prop({ type: String, required: true })
  numberOfFollowers: string;

  @Prop({ type: String, required: true })
  verifiedClaims: string;

  @Prop({ type: String, required: true })
  activeInfluencers: string;

  @Prop({ type: String, required: true })
  yearlyRevenue: string;

  @Prop({ type: String, required: true })
  products: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: [
      {
        title: String,
        description: String,
        audio: String,
        publishedAt: Number,
        link: String,
        highlighted: String,
      },
    ],
    default: [],
  })
  podcasts: Array<{
    title: string;
    audio: string;
    description: string;
    link: string;
    highlighted: string;
    publishedAt: number; // Timestamp or date of publication
  }>;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
