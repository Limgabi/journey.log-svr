import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  userName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,20}$/, {
    message: '비밀번호는 소문자, 숫자, 특수문자를 최소 하나씩 포함해야 합니다.',
  })
  password: string;
}
