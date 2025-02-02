/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Client } from 'podcast-api';

@Injectable()
export class TwitterService {
  private client: any;

  constructor() {
    // Initialize the podcast-api client with the API key from environment variables
    this.client = Client({
      apiKey: '46c8174e8cdc4b26aa57bdae884802c8',
    });
  }

  async searchPodcasts(query: string) {
    try {
      const response = await this.client.search({
        q: query,
        sort_by_date: 1,
        only_in: 'title,description',
      });

      return response.data; // Return the data from the API response
    } catch (error) {
      console.error('Error searching podcasts:', error);
      throw new Error('Unable to fetch podcast data');
    }
  }
}
