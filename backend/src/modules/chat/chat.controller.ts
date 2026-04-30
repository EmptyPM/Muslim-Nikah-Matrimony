import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { SendMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

type UploadedAttachment = {
  mimetype: string;
  originalname: string;
  size: number;
  buffer: Buffer;
};

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly service: ChatService,
    private readonly gateway: ChatGateway,
  ) {}

  @Post('send')
  async send(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
    const result = await this.service.send(user.userId, dto);
    const message = result.data;
    // Emit for both sender and receiver so REST-sent messages are also real-time.
    this.gateway.pushMessage(dto.senderProfileId, message);
    this.gateway.pushMessage(dto.receiverProfileId, message);
    return result;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file?: UploadedAttachment) {
    if (!file) {
      throw new BadRequestException({ success: false, message: 'No file uploaded' });
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException({ success: false, message: 'File too large. Max 10 MB.' });
    }
    const allowedMime =
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'text/plain';
    if (!allowedMime) {
      throw new BadRequestException({
        success: false,
        message: 'Unsupported file type. Use image, PDF, DOC, DOCX, or TXT.',
      });
    }
    const uploaded = await this.service.uploadAttachment(file);
    return { success: true, data: uploaded };
  }

  @Get('history/:myProfileId/:otherProfileId')
  history(@Param('myProfileId') myId: string, @Param('otherProfileId') otherId: string) {
    return this.service.getHistory(myId, otherId);
  }

  @Get('conversations/:profileId')
  conversations(@Param('profileId') profileId: string) {
    return this.service.getConversations(profileId);
  }

  /** Returns { [senderProfileId]: unreadCount } for badge display */
  @Get('unread/:profileId')
  unreadCounts(@Param('profileId') profileId: string) {
    return this.service.getUnreadCounts(profileId);
  }

  /** REST fallback for marking messages as read + emitting real-time blue tick */
  @Post('mark-read')
  async markRead(
    @Body() body: { myProfileId: string; otherProfileId: string },
  ) {
    const readIds = await this.service.markRead(body.myProfileId, body.otherProfileId);
    if (readIds.length > 0) {
      // Push messages_read event to the SENDER's socket room so their ticks go blue
      this.gateway.emitMessagesRead(body.otherProfileId, body.myProfileId, readIds);
    }
    return { success: true, readCount: readIds.length };
  }
}
