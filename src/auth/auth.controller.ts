import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }
}
