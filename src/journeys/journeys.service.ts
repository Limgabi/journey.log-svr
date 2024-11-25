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
   * @param user 여행 기록 작성자
   * @returns 작성된 journey id
   */
  async createJourney(
    createJourneyDto: CreateJourneyDto,
    user: User,
  ): Promise<{ id: string }> {
    const journey = this.journeyRepository.create({
      id: uuidv4(),
      ...createJourneyDto,
      user,
    });

    try {
      await this.journeyRepository.save(journey);
      return { id: journey.id };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * 여행 기록 전체 조회
   * @returns 여행 기록
   */
  async getAllJourneys(): Promise<Journey[]> {
    return this.journeyRepository.find();
  }

  /**
   * 특정 사용자가 작성한 여행 기록 조회
   * @param user 사용자
   * @returns 여행 기록
   */
  async getJourneys(userId: string): Promise<Journey[]> {
    const query = this.journeyRepository.createQueryBuilder('journey');
    query.where('journey.userId = :userId', { userId });

    const journeys = await query.getMany();
    return journeys;
  }
}
