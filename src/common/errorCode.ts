export enum ErrorCode {
  USER_ALREADY_EXIST = 1001, // 이미 존재하는 유저로 회원가입 시도

  USER_NOT_AUTHENTICATED = 1002, // 회원가입되지 않은 유저로 로그인 시도
  INVALID_PASSWORD = 1003, // 비밀번호 틀림

  INVALID_TOKEN = 1004, // 토큰이 잘못되었거나 인증이 안 되었을 때
}
