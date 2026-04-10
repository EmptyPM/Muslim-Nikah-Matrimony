import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogActivityDto {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  category: string;
  entityId?: string;
  entityLabel?: string;
  meta?: Record<string, any>;
  level?: 'INFO' | 'WARNING' | 'ERROR';
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Write one activity entry — fire-and-forget safe */
  async log(dto: LogActivityDto): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          actorId:     dto.actorId    ?? null,
          actorEmail:  dto.actorEmail ?? null,
          actorRole:   dto.actorRole  ?? null,
          action:      dto.action,
          category:    dto.category,
          entityId:    dto.entityId    ?? null,
          entityLabel: dto.entityLabel ?? null,
          meta:        dto.meta        ?? undefined,
          level:       dto.level       ?? 'INFO',
          ipAddress:   dto.ipAddress   ?? null,
          userAgent:   dto.userAgent   ?? null,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to write activity log: ${err?.message}`);
    }
  }

  /** Paginated list for admin — newest first */
  async getAll(opts: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
  }) {
    const page  = Math.max(1, opts.page  ?? 1);
    const limit = Math.min(100, opts.limit ?? 50);
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (opts.category) where.category  = opts.category;
    if (opts.level)    where.level      = opts.level;
    if (opts.search) {
      where.OR = [
        { action:      { contains: opts.search, mode: 'insensitive' } },
        { actorEmail:  { contains: opts.search, mode: 'insensitive' } },
        { entityLabel: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.activityLog.count({ where }),
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      success: true,
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  /** Stats helper — category + level breakdown */
  async getStats() {
    const [byCategory, byLevel, recentCount] = await Promise.all([
      this.prisma.activityLog.groupBy({ by: ['category'], _count: { id: true } }),
      this.prisma.activityLog.groupBy({ by: ['level'],    _count: { id: true } }),
      this.prisma.activityLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);
    return { success: true, data: { byCategory, byLevel, recentCount } };
  }
}
