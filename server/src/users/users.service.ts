import { Injectable } from '@nestjs/common';

import type { User } from '../chat/chat.types';

type AddUserResult = { user: User; error?: never } | { user?: never; error: string };

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  addUser({ id, name, room }: User): AddUserResult {
    const normalizedName = name.trim().toLowerCase();
    const normalizedRoom = room.trim().toLowerCase();

    if (!normalizedName || !normalizedRoom) {
      return { error: 'Username and room are required.' };
    }

    const existingUser = this.users.find(
      (user) => user.room === normalizedRoom && user.name === normalizedName,
    );

    if (existingUser) {
      return { error: 'Username is taken.' };
    }

    const user = { id, name: normalizedName, room: normalizedRoom };
    this.users.push(user);

    return { user };
  }

  removeUser(id: string): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }

    return undefined;
  }

  getUser(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUsersInRoom(room: string): User[] {
    return this.users.filter((user) => user.room === room);
  }
}
