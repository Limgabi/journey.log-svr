import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateJourneyDto } from './dto/createJourney.dto';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';

@Controller('journeys')
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Post()
  @UseGuards(AuthGuard())
  createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    @GetUser() user: User,
  ) {
    return this.journeyService.createJourney(createJourneyDto, user);
  }

  @Get()
  getJourneys(@Query('userId') userId: string) {
    if (userId) {
      return this.journeyService.getJourneys(userId);
    }
    return this.journeyService.getAllJourneys();
  }
}
