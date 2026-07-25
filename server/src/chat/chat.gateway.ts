import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Ack } from '@nestjs/websockets/decorators/ack.decorator';
import { Server, Socket } from 'socket.io';

import type { JoinPayload } from './chat.types';
import { corsOrigin } from '../config/cors';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  constructor(private readonly usersService: UsersService) {}

  handleConnection() {
    return undefined;
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() { name, room }: JoinPayload,
    @ConnectedSocket() client: Socket,
    @Ack() callback?: (error?: string) => void,
  ) {
    const { error, user } = this.usersService.addUser({ id: client.id, name, room });

    if (error) {
      callback?.(error);
      return;
    }

    if (!user) {
      callback?.('Unable to join room.');
      return;
    }

    client.join(user.room);

    client.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    client.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined!`,
    });

    this.server.to(user.room).emit('roomData', {
      room: user.room,
      users: this.usersService.getUsersInRoom(user.room),
    });

    callback?.();
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
    @Ack() callback?: () => void,
  ) {
    const user = this.usersService.getUser(client.id);

    if (user) {
      this.server.to(user.room).emit('message', { user: user.name, text: message });
    }

    callback?.();
  }

  handleDisconnect(client: Socket) {
    const user = this.usersService.removeUser(client.id);

    if (user) {
      this.server.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      this.server.to(user.room).emit('roomData', {
        room: user.room,
        users: this.usersService.getUsersInRoom(user.room),
      });
    }
  }
}
