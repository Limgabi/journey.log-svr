import { SignUpDto } from './dto/signUp.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/common/errorCode';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  /**
   * 회원가입
   * @param signUpDto userName, userId, password
   * @returns 생성된 user의 id
   */
  async signUp(signUpDto: SignUpDto): Promise<{ userId: string }> {
    const { userName, userId, password } = signUpDto;

    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      id: uuidv4(),
      userName,
      userId,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
      return { userId: user.id };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 사용자입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 로그인
   * @param signInDto userId, password
   * @returns accessToken
   */
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { userId, password } = signInDto;
    const user = await this.userRepository.findOne({ where: { userId } });

    // 존재하지 않는 유저 (id 없는 경우)
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
        message:
          '입력한 사용자 정보와 일치하는 계정이 없습니다. 유효한 사용자 ID를 확인하세요.',
      });
    }

    // 비밀번호가 틀린 경우
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: ErrorCode.INVALID_PASSWORD,
        message:
          '입력한 비밀번호가 올바르지 않습니다. 비밀번호를 다시 확인해주세요.',
      });
    }

    // 로그인 성공
    const payload = { userId };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
