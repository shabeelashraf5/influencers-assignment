import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';
import { Influencer } from '../../schemas/openai.schema';
import { Model } from 'mongoose';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private twitterClient: TwitterApi;

  constructor(
    @InjectModel(Influencer.name) private influencerModel: Model<Influencer>,
  ) {
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

  // async getInfluencerDetails() {
  //   try {
  //     const response = await this.openai.chat.completions.create({
  //       model: 'gpt-3.5-turbo',
  //       messages: [
  //         {
  //           role: 'user',
  //           content: `Provide a list of 10 health influencers, including the following details:
  //               1. Name
  //               2. Rank
  //               3. Category (e.g., Nutrition, Fitness, Mental Health, etc.)
  //               4. Trust Score (as a percentage, e.g., 85% or 90%)
  //               5. Trend (Hot, Rising, Stable, etc.)
  //               6. Number of Followers
  //               7. Verified Claims (Yes or No)

  //               Please ensure the influencers are well-known and relevant in the health industry, and provide the trust score in percentage format.`,
  //         },
  //       ],
  //     });

  //     return {
  //       success: true,
  //       message: 'User logged in successfully',
  //       influencers: response.choices[0].message.content,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching influencer details:', error);
  //     throw error;
  //   }
  // }

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
              8. Active Influencers (Yes or No)
  
              Please ensure the influencers are well-known and relevant in the health industry, and provide the trust score in percentage format. After listing the influencers, calculate:
              - Active Influencers (Count the number of influencers who are active)
              - Claim Verified (Count the number of influencers with verified claims)
              - Average Trust Score (Calculate the average of the trust scores in percentage).`,
          },
        ],
      });

      if (response?.choices?.[0]?.message?.content) {
        const influencerContent = response.choices[0].message.content.trim();
        console.log('Influencer Content:', influencerContent);

        const influencersArray = influencerContent
          .split('\n\n')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        console.log('Parsed Influencers Array:', influencersArray);

        const parsedInfluencers = influencersArray
          .slice(0, 10)
          .map((influencer) => {
            const details = influencer
              .split('\n')
              .map((detail) => detail.trim());
            console.log('Parsed Details:', details);

            const influencerObject = {
              Name: details[0]?.replace(/^\d+\.\s*/, '') || 'No Name Found',
              Rank: details[1]?.split(':')[1]?.trim() || 'No Rank Found',
              Category:
                details[2]?.split(':')[1]?.trim() || 'No Category Found',
              TrustScore: parseFloat(details[3]?.split(':')[1]?.trim()) || 0,
              Trend: details[4]?.split(':')[1]?.trim() || 'No Trend Found',
              Followers:
                details[5]?.split(':')[1]?.trim() || 'No Followers Found',
              VerifiedClaims:
                details[6]?.split(':')[1]?.trim() || 'No Verified Claims Found',
              ActiveInfluencers:
                details[7]?.split(':')[1]?.trim() === 'Yes' ? 1 : 0,
            };

            return influencerObject;
          });

        const activeInfluencers = parsedInfluencers.filter(
          (influencer) => influencer.ActiveInfluencers === 1,
        ).length;

        const claimVerified = parsedInfluencers.filter(
          (influencer) => influencer.VerifiedClaims === 'Yes',
        ).length;

        const totalTrustScore = parsedInfluencers.reduce(
          (sum, influencer) => sum + influencer.TrustScore,
          0,
        );
        const averageTrustScore = totalTrustScore / parsedInfluencers.length;

        return {
          success: true,
          message: 'Top 10 influencers fetched successfully',
          influencers: parsedInfluencers,
          statistics: {
            ActiveInfluencers: activeInfluencers,
            ClaimVerified: claimVerified,
            AverageTrustScore: averageTrustScore.toFixed(2) + '%',
          },
        };
      } else {
        throw new Error(
          'Invalid response format: No influencer content found.',
        );
      }
    } catch (error) {
      console.error('Error fetching influencer details:', error);
      throw error;
    }
  }

  // async fetchInfluencerDetails(name: string) {
  //   try {
  //     const prompt = `Find details about the influencer ${name}. Format:
  //     Name:
  //     Rank:
  //     Category:
  //     Trust Score:
  //     Trend:
  //     Number of Followers:
  //     Verified Claims:
  //     Active Influencers: `;

  //     const response = await this.openai.completions.create({
  //       model: 'gpt-3.5-turbo',
  //       prompt,
  //     });

  //     console.log('Response:', response);

  //     return {
  //       success: true,
  //       message: 'Influencers Created',
  //       influencers: response.choices[0].text,
  //     };
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  async fetchInfluencerDetails(name: string) {
    try {
      const prompt = `Find details about the influencer ${name}. Format:
      1.Name
      2.Description
      3.Category (e.g., Nutrition, Fitness, Mental Health, etc.) 
      4.Trust Score (as a percentage, e.g., 85% or 90%)
      5.Trend (Hot, Rising, Stable, etc.)
      6.Number of Followers (only numbers twitter)
      7.Verified Claims (Yes or No) 
      8.Active Influencers (Yes or No)`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that helps gather influencer information.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      console.log('Full Response:', response);

      if (
        response &&
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message?.content
      ) {
        const influencerData = response.choices[0].message.content.split('\n');

        // Assuming that each line of the response is in the following format:
        // 1. Name: Andrew Huberman
        // 2. Description: Expert in mental health and neuroscience
        // 3. Category: Mental Health
        // 4. Trust Score: 90%
        // 5. Trend: Rising
        // 6. Number of Followers: 1500000
        // 7. Verified Claims: Yes
        // 8. Active Influencers: Yes

        const influencer = new this.influencerModel({
          name: influencerData[0].split(': ')[1], // Extract name
          description: influencerData[1].split(': ')[1], // Extract description
          category: influencerData[2].split(': ')[1], // Extract category
          trustScore: influencerData[3].split(': ')[1], // Extract trust score
          trend: influencerData[4].split(': ')[1], // Extract trend
          numberOfFollowers: parseInt(influencerData[5].split(': ')[1]), // Extract followers as a number
          verifiedClaims: influencerData[6].split(': ')[1] === 'Yes', // Convert Yes/No to boolean
          activeInfluencers: influencerData[7].split(': ')[1] === 'Yes', // Convert Yes/No to boolean
        });

        await influencer.save(); // Save to database

        console.log('Saved Influencer:', influencer);

        return {
          success: true,
          message: 'Influencer details fetched and saved successfully',
          influencers: influencer,
        };
      } else {
        console.log('No influencer details found.');
        return {
          success: false,
          message: 'No details found for the influencer',
        };
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        message: 'An error occurred while fetching influencer details',
      };
    }
  }
}
