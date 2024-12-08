import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { CreateJourneyDto } from './dto/createJourney.dto';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { CustomAuthGuard } from 'src/auth/custom-auth-guard';

@Controller('journeys')
@UseGuards(CustomAuthGuard)
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Post()
  createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    @GetUser() user: User,
  ) {
    return this.journeyService.createJourney(createJourneyDto, user);
  }

  @Get()
  getJourneys(@Query('userId') userId: string, @GetUser() user: User | null) {
    if (userId) {
      return this.journeyService.getJourneys(userId, user || undefined);
    }
    return this.journeyService.getAllJourneys(user || undefined);
  }
}
