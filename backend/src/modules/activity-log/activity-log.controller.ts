import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/activity-logs')
export class ActivityLogController {
  constructor(private readonly service: ActivityLogService) {}

  @Get()
  getAll(
    @Query('page')     page?:     string,
    @Query('limit')    limit?:    string,
    @Query('category') category?: string,
    @Query('level')    level?:    string,
    @Query('search')   search?:   string,
  ) {
    return this.service.getAll({
      page:     page     ? parseInt(page)  : 1,
      limit:    limit    ? parseInt(limit) : 50,
      category: category || undefined,
      level:    level    || undefined,
      search:   search   || undefined,
    });
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }
}
