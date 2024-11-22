import { SignUpDto } from './dto/signUp.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
  async signUp(signUpDto: SignUpDto): Promise<string> {
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
      return user.id;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 사용자입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
