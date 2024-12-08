import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from 'src/common/errorCode';

@Injectable()
export class CustomAuthGuard extends AuthGuard() {
  handleRequest(err, user) {
    if (err || !user) {
      // 토큰이 잘못되었거나 인증이 안 되었을 때
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: ErrorCode.INVALID_TOKEN,
        message: '유효하지 않은 토큰입니다.',
      });
    }
    return user;
  }
}
