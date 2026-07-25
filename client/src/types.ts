export type User = {
  id: string;
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

export type ServerToClientEvents = {
  message: (message: ChatMessage) => void;
  roomData: (data: RoomData) => void;
};

export type ClientToServerEvents = {
  join: (payload: { name: string; room: string }, callback: (error?: string) => void) => void;
  sendMessage: (message: string, callback: () => void) => void;
};
