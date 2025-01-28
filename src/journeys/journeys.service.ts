import { isOwner, isPublic } from './utils/journey.utils';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      userId: user.id,
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
  async getAllJourneys(user?: User): Promise<Journey[]> {
    if (user) {
      // PUBLIC 상태의 글 가져오기
      const publicJourneys = this.journeyRepository.find({
        where: { status: 'PUBLIC' },
      });

      // 로그인한 사용자의 모든 글 가져오기
      const ownJourneys = this.getJourneys(user.id, user);

      const [publicResults, ownResults] = await Promise.all([
        publicJourneys,
        ownJourneys,
      ]);

      const allJourneys = Array.from(
        new Map(
          publicResults.concat(ownResults).map((j) => [j.id, j]),
        ).values(),
      );

      return allJourneys;
    }

    // 로그인하지 않은 경우 PUBLIC 상태의 글만 반환
    return this.journeyRepository.find({
      where: { status: 'PUBLIC' },
    });
  }

  /**
   * 특정 사용자가 작성한 여행 기록 조회
   * @param user 사용자
   * @returns 여행 기록
   */
  async getJourneys(userId: string, user?: User): Promise<Journey[]> {
    // 로그인한 사용자와 조회 대상 사용자가 같은 경우
    if (user && user.id === userId) {
      return this.journeyRepository.find({ where: { userId } });
    } else {
      // 다른 사용자의 글은 PUBLIC 상태만 조회
      return this.journeyRepository.find({
        where: { userId, status: 'PUBLIC' },
      });
    }
  }

  /**
   * 여행 기록 상세 조회
   * @param id 여행 기록 id
   * @param user 요청 사용자 정보
   * @returns 여행 기록
   */
  async getJourneyDetail(id: string, user: User): Promise<Journey> {
    // id로 여행 기록 조회
    const journey = await this.journeyRepository.findOne({
      where: { id },
    });

    if (!journey) {
      throw new NotFoundException('존재하지 않는 여행 기록 id 입니다.');
    }

    //권한 확인
    const isAuthorized = isOwner(journey, user) || isPublic(journey);
    if (!isAuthorized) {
      throw new ForbiddenException('여행 기록 조회 권한이 없습니다.');
    }

    return journey;
  }
}
