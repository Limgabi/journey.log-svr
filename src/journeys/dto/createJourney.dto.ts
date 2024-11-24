import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

class Coordinates {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class Place {
  @IsString()
  id: string;

  @IsString()
  placeName: string;

  @IsString()
  addressName: string;
}

export class CreateJourneyDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Coordinates)
  coordinates: Coordinates;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Place)
  places: Place[];

  @IsArray()
  @IsString({ each: true })
  @Optional()
  tags?: string[];

  @IsEnum(['PUBLIC', 'PRIVATE'])
  status: 'PUBLIC' | 'PRIVATE';
}
