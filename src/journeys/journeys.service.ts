import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Journey } from './journey.entity';
import { Repository } from 'typeorm';
import { CreateJourneyDto } from './dto/createJourney.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/auth/user.entity';

@Injectable()
export class JourneysService {
  constructor(
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  /**
   * 여행 기록 작성
   * @param createJourneyDto coordinates, images, content, places, tags, status
   * @param author 여행 기록 작성자
   * @returns 작성된 journey id
   */
  async createJourney(
    createJourneyDto: CreateJourneyDto,
    author: User,
  ): Promise<{ id: string }> {
    const journey = this.journeyRepository.create({
      id: uuidv4(),
      ...createJourneyDto,
      author,
    });

    try {
      await this.journeyRepository.save(journey);
      return { id: journey.id };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
