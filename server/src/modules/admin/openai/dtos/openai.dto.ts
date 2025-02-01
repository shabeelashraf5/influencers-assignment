import { IsNotEmpty, IsString } from 'class-validator';

export class createInfluencersDto {
  @IsString()
  @IsNotEmpty()
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
