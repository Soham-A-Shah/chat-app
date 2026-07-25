import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io, { Socket } from "socket.io-client";
import { RouteComponentProps } from 'react-router-dom';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import {
  ChatMessage,
  ClientToServerEvents,
  RoomData,
  ServerToClientEvents,
  User,
} from '../../types';

import './Chat.css';

const ENDPOINT = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5010';

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: ChatSocket | undefined;

const Chat = ({ location }: RouteComponentProps) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const parsedQuery = queryString.parse(location.search);
    const queryName = Array.isArray(parsedQuery.name) ? parsedQuery.name[0] : parsedQuery.name;
    const queryRoom = Array.isArray(parsedQuery.room) ? parsedQuery.room[0] : parsedQuery.room;
    const nextName = queryName || '';
    const nextRoom = queryRoom || '';

    const activeSocket = io(ENDPOINT) as ChatSocket;
    socket = activeSocket;

    setRoom(nextRoom);
    setName(nextName);

    activeSocket.on('message', (incomingMessage: ChatMessage) => {
      setMessages((currentMessages) => [ ...currentMessages, incomingMessage ]);
    });

    activeSocket.on("roomData", ({ users }: RoomData) => {
      setUsers(users);
    });

    activeSocket.emit('join', { name: nextName, room: nextRoom }, (error?: string) => {
      if(error) {
        alert(error);
      }
    });

    return () => {
      activeSocket.off('message');
      activeSocket.off('roomData');
      activeSocket.disconnect();
    };
  }, [location.search]);

  const sendMessage = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if(message && socket) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
