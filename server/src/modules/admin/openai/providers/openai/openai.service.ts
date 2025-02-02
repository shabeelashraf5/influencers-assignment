import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import OpenAI from 'openai';
import { Influencer } from '../../schemas/openai.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';

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

    // this.twitterClient = new TwitterApi(bearerToken as string);
    // this.twitterClient = new TwitterApi({
    //   clientId: process.env.TWITTER_API_KEY,
    //   clientSecret: process.env.TWITTER_API_SECRET_KEY,
    //   accessToken: process.env.TWITTER_ACCESS_TOKEN,
    //   accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
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

  async fetchInfluencerDetails(name: string) {
    try {
      const prompt = `Find details about the influencer ${name}. Format:
      1.Name
      2.Description
      3.Category (e.g., Nutrition, Fitness, Mental Health, etc.)
      4.Trust Score (as a percentage, e.g., 85% or 90%)
      5.Trend (Hot, Rising, Stable, etc.)
      6.Number of Followers
      7.Verified Claims (Yes or No)
      8.Active Influencers (Yes or No)
      9.Yearly Revenue (In Numbers)
      10.Products (Number of Products In Numbers)
   `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that helps gather influencer information.',
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
        console.log('Influencer Data:', influencerData);
        const influencer = new this.influencerModel({
          name: influencerData[0].split(': ')[1], // Extract name
          description: influencerData[1].split(': ')[1], // Extract description
          category: influencerData[2]
            .split(': ')[1]
            .split(',')
            .map((c) => c.trim()), // Extract category
          trustScore: influencerData[3].split(': ')[1], // Extract trust score
          trend: influencerData[4].split(': ')[1], // Extract trend
          numberOfFollowers: influencerData[5].split(': ')[1], // Extract followers as a number
          verifiedClaims: influencerData[6].split(': ')[1].trim(), // Convert Yes/No to boolean
          activeInfluencers: influencerData[7].split(': ')[1].trim(),
          yearlyRevenue: influencerData[8].split(': ')[1], // Extract yearly revenue
          products: influencerData[9].split(': ')[1], // Convert Yes/No to boolean
          createdAt: new Date(),
        });

        console.log('Final Influencer Object:', influencer);

        const existingInfluencer = await this.influencerModel.findOne({
          name: influencer.name,
        });

        if (existingInfluencer) {
          console.log('Influencer already exists, updating details');
          throw new HttpException(
            'Influencer already exists, updating details',
            HttpStatus.UNAUTHORIZED,
          );
        }
        await influencer.save(); // Save to database

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

  async displayInfluncers() {
    try {
      const influencersDetails = await this.influencerModel
        .find({})
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        message: 'All Users displayed successfully',
        users: influencersDetails,
      };
    } catch (error) {
      console.error('Error', error);
    }
  }

  async deleteInfluncers(userId: string) {
    try {
      const deleteList = await this.influencerModel.findOneAndDelete({
        _id: userId,
      });

      return {
        success: true,
        message: 'List Deleted',
        dlist: deleteList,
      };
    } catch (error) {
      console.error('Error', error);
    }
  }

  async showInfluncers(userId: string) {
    try {
      const showList = await this.influencerModel.findById(userId);

      return {
        success: true,
        message: 'List Appeared',
        showlist: showList,
      };
    } catch (error) {
      console.error('Error', error);
    }
  }
}
