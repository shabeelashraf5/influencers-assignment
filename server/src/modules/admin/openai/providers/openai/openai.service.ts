/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import OpenAI from 'openai';
import { Influencer } from '../../schemas/openai.schema';
import { Model } from 'mongoose';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterService } from 'src/modules/admin/twitter/providers/twitter/twitter.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private twitterClient: TwitterApi;
  // private readonly BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  // private readonly BASE_TWITTER_URL = 'https://api.twitter.com/2';

  constructor(
    @InjectModel(Influencer.name) private influencerModel: Model<Influencer>,
    private readonly twitterService: TwitterService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAPI_API_KEY,
    });
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

  // async fetchInfluencerDetails(name: string) {
  //   try {
  //     const prompt = `Find details about the influencer ${name}. Format:
  //     1.Name
  //     2.Description
  //     3.Category (e.g., Nutrition, Fitness, Mental Health, etc.)
  //     4.Trust Score (as a percentage, e.g., 85% or 90%)
  //     5.Trend (Hot, Rising, Stable, etc.)
  //     6.Number of Followers
  //     7.Verified Claims (Yes or No)
  //     8.Active Influencers (Yes or No)
  //     9.Yearly Revenue (In Numbers)
  //     10.Products (Number of Products In Numbers)
  //  `;

  //     const response = await this.openai.chat.completions.create({
  //       model: 'gpt-3.5-turbo',
  //       messages: [
  //         {
  //           role: 'system',
  //           content:
  //             'You are an assistant that helps gather influencer information.',
  //         },
  //         {
  //           role: 'user',
  //           content: prompt,
  //         },
  //       ],
  //     });

  //     console.log('Full Response:', response);

  //     if (
  //       response &&
  //       response.choices &&
  //       response.choices.length > 0 &&
  //       response.choices[0].message?.content
  //     ) {
  //       const influencerData = response.choices[0].message.content.split('\n');
  //       console.log('Influencer Data:', influencerData);
  //       const influencer = new this.influencerModel({
  //         name: influencerData[0].split(': ')[1], // Extract name
  //         description: influencerData[1].split(': ')[1], // Extract description
  //         category: influencerData[2]
  //           .split(': ')[1]
  //           .split(',')
  //           .map((c) => c.trim()), // Extract category
  //         trustScore: influencerData[3].split(': ')[1], // Extract trust score
  //         trend: influencerData[4].split(': ')[1], // Extract trend
  //         numberOfFollowers: influencerData[5].split(': ')[1], // Extract followers as a number
  //         verifiedClaims: influencerData[6].split(': ')[1].trim(), // Convert Yes/No to boolean
  //         activeInfluencers: influencerData[7].split(': ')[1].trim(),
  //         yearlyRevenue: influencerData[8].split(': ')[1], // Extract yearly revenue
  //         products: influencerData[9].split(': ')[1], // Convert Yes/No to boolean
  //         createdAt: new Date(),
  //       });

  //       console.log('Final Influencer Object:', influencer);

  //       const existingInfluencer = await this.influencerModel.findOne({
  //         name: influencer.name,
  //       });

  //       if (existingInfluencer) {
  //         console.log('Influencer already exists, updating details');
  //         throw new HttpException(
  //           'Influencer already exists, updating details',
  //           HttpStatus.UNAUTHORIZED,
  //         );
  //       }

  //       await influencer.save(); // Save to database

  //       return {
  //         success: true,
  //         message: 'Influencer details fetched and saved successfully',
  //         influencers: influencer,
  //       };
  //     } else {
  //       console.log('No influencer details found.');
  //       return {
  //         success: false,
  //         message: 'No details found for the influencer',
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     return {
  //       success: false,
  //       message: 'An error occurred while fetching influencer details',
  //     };
  //   }
  // }

  async fetchInfluencerDetails(name: string) {
    try {
      // Step 1: Fetch influencer details using OpenAI
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

      // Check if the response contains valid data
      if (
        response &&
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message?.content
      ) {
        const influencerData = response.choices[0].message.content.split('\n');
        console.log('Influencer Data:', influencerData);

        // Create an influencer object with the data from OpenAI
        const influencer = new this.influencerModel({
          name: influencerData[0].split(': ')[1] || 'Unknown', // Extract name
          description:
            influencerData[1].split(': ')[1] || 'No description available', // Extract description
          category: influencerData[2]
            ? influencerData[2]
                .split(': ')[1]
                .split(',')
                .map((c) => c.trim()) // Extract category
            : [],
          trustScore: influencerData[3].split(': ')[1] || 'N/A', // Extract trust score
          trend: influencerData[4].split(': ')[1] || 'Unknown', // Extract trend
          numberOfFollowers: influencerData[5].split(': ')[1] || 'N/A', // Extract followers as a number
          verifiedClaims: influencerData[6].split(': ')[1].trim() || 'No', // Convert Yes/No to boolean
          activeInfluencers: influencerData[7].split(': ')[1].trim() || 'No',
          yearlyRevenue: influencerData[8].split(': ')[1] || 'N/A', // Extract yearly revenue
          products: influencerData[9].split(': ')[1] || 'N/A', // Extract products
          createdAt: new Date(),
        });

        // Check if the influencer already exists in the database
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
        const podcasts = await this.twitterService.searchPodcasts(
          influencer.name,
        );
        console.log('Fetched Podcasts:', podcasts);

        // Step 3: Fetch podcasts related to the influencer name
        const cleanedPodcasts = podcasts.results.map((podcast) => ({
          title: podcast.title_original, // Title of the podcast
          audio: podcast.audio, // Audio URL
          image: podcast.image, // Podcast Image
          link: podcast.link,
          description: podcast.description_original,
          highlighted: podcast.description_highlighted, // Podcast Link
        }));

        // Step 4: Update influencer's podcasts field and save
        influencer.podcasts =
          cleanedPodcasts.length > 0 ? cleanedPodcasts : ['No podcasts found'];

        // Step 2: Save influencer data to the database
        await influencer.save();
        console.log('Influencer details saved:', influencer);

        await influencer.save(); // Save the updated influencer with podcasts

        return {
          success: true,
          message:
            'Influencer and podcast details fetched and saved successfully',
          influencer,
        };
      } else {
        console.log('No influencer details found.');
        return {
          success: false,
          message:
            'No details found for the influencer. Please check the name or try again later.',
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

  // async fetchInfluencerDetails(name: string) {
  //   try {
  //     // Fetch influencer details from OpenAI
  //     const prompt = `Find details about the influencer ${name}. Format:
  //     1. Name
  //     2. Description
  //     3. Category
  //     4. Trust Score
  //     5. Trend
  //     6. Number of Followers
  //     7. Verified Claims (Yes/No)
  //     8. Active Influencers (Yes/No)
  //     9. Yearly Revenue
  //     10. Products`;

  //     const response = await this.openai.chat.completions.create({
  //       model: 'gpt-3.5-turbo',
  //       messages: [
  //         {
  //           role: 'system',
  //           content:
  //             'You are an assistant that helps gather influencer information.',
  //         },
  //         { role: 'user', content: prompt },
  //       ],
  //     });

  //     if (
  //       !response ||
  //       !response.choices ||
  //       response.choices.length === 0 ||
  //       !response.choices[0].message.content
  //     ) {
  //       return { success: false, message: 'No details found' };
  //     }

  //     // Extract influencer details from OpenAI response
  //     const influencerData = response.choices[0].message.content.split('\n');

  //     // Fetch latest 10 tweets using Twitter API
  //     const twitterBearerToken =
  //       'AAAAAAAAAAAAAAAAAAAAAHNOygEAAAAAbDTBTY36%2BZDpt%2BzSHz8Ny988gb8%3DIbXLMgl8QnszjcZFdtA52Gk3h3U4amAz3045g7KFQN5B3WSSUf'; // Replace with your token
  //     const tweetsResponse = await axios.get(
  //       `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(name)}&max_results=10`,
  //       { headers: { Authorization: `Bearer ${twitterBearerToken}` } },
  //     );

  //     // Parse tweets
  //     const tweets = tweetsResponse.data.data.map((tweet: any) => ({
  //       id: tweet.id,
  //       text: tweet.text,
  //     }));

  //     // Create influencer object
  //     const influencer = new this.influencerModel({
  //       name: influencerData[0].split(': ')[1],
  //       description: influencerData[1].split(': ')[1],
  //       category: influencerData[2]
  //         .split(': ')[1]
  //         .split(',')
  //         .map((c) => c.trim()),
  //       trustScore: influencerData[3].split(': ')[1],
  //       trend: influencerData[4].split(': ')[1],
  //       numberOfFollowers: influencerData[5].split(': ')[1],
  //       verifiedClaims: influencerData[6].split(': ')[1].trim(),
  //       activeInfluencers: influencerData[7].split(': ')[1].trim(),
  //       yearlyRevenue: influencerData[8].split(': ')[1],
  //       products: influencerData[9].split(': ')[1],
  //       tweets, // Store tweets
  //       createdAt: new Date(),
  //     });

  //     // Check if influencer already exists
  //     const existingInfluencer = await this.influencerModel.findOne({
  //       name: influencer.name,
  //     });
  //     if (existingInfluencer) {
  //       return { success: false, message: 'Influencer already exists' };
  //     }

  //     await influencer.save(); // Save influencer data

  //     return {
  //       success: true,
  //       message: 'Influencer details fetched and saved successfully',
  //       influencer,
  //     };
  //   } catch (error) {
  //     console.error('Error:', error);
  //     return {
  //       success: false,
  //       message: 'An error occurred while fetching influencer details',
  //     };
  //   }
  // }

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
