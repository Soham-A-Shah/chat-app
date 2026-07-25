import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ChatGateway } from './chat/chat.gateway';
import { UsersService } from './users/users.service';

@Module({
  controllers: [AppController],
  providers: [ChatGateway, UsersService],
})
export class AppModule {}
