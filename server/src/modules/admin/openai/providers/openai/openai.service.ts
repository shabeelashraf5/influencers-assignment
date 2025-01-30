import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private twitterClient: TwitterApi;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAPI_API_KEY,
    });

    // this.twitterClient = new TwitterApi({
    //   clientId: process.env.TWITTER_API_KEY,
    //   clientSecret: process.env.TWITTER_API_SECRET,
    //   accessToken: process.env.TWITTER_ACCESS_TOKEN,
    //   accessSecret: process.env.TWITTER_ACCESS_SECRET,
    // });
  }

  async getInfluencerDetails() {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Provide a list of 10 health influencers, including the following details:
                1. Name
                2. Rank
                3. Category (e.g., Nutrition, Fitness, Mental Health, etc.)
                4. Trust Score (as a percentage, e.g., 85% or 90%)
                5. Trend (Hot, Rising, Stable, etc.)
                6. Number of Followers
                7. Verified Claims (Yes or No)
                
                Please ensure the influencers are well-known and relevant in the health industry, and provide the trust score in percentage format.`,
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching influencer details:', error);
      throw error;
    }
  }
}
