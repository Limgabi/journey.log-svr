import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * 토큰 유효성 체크 후, validate 메서드의 payload에 있는 유저 id가 DB에 있으면 유저 객체 return
   */
  async validate(payload) {
    const { userId } = payload;
    const user: User = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
