import { IsString } from 'class-validator';

export class createInfluencersDto {
  @IsString()
  name: string;

  //   @IsNumber()
  //   rank: number;

  //   @IsString()
  //   category: string;

  //   @IsString()
  //   trustScore: string;

  //   @IsString()
  //   trend: string;

  //   @IsNumber()
  //   followers: number;

  //   @IsBoolean()
  //   verified: boolean;

  //   @IsBoolean()
  //   active: boolean;
}
