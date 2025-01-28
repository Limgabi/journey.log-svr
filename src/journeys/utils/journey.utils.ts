import { User } from 'src/auth/user.entity';
import { Journey } from '../journey.entity';

/**
 * 여행 기록이 공개 상태인지 확인
 * @param journey 여행 기록
 * @returns 공개 상태 여부
 */
const isPublic = (journey: Journey): boolean => {
  return journey.status === 'PUBLIC';
};

/**
 * 여행 기록 작성자인지 확인
 * @param journey 여행 기록
 * @param user 요청 사용자
 * @returns 작성자 여부
 */
const isOwner = (journey: Journey, user: User): boolean => {
  return journey.userId === user.id;
};

export { isPublic, isOwner };
