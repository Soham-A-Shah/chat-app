export type User = {
  id: string;
  name: string;
  room: string;
};

export type JoinPayload = {
  name: string;
  room: string;
};

export type ChatMessage = {
  user: string;
  text: string;
};

export type RoomData = {
  room: string;
  users: User[];
};
