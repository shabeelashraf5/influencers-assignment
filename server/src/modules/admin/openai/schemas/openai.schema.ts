import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
