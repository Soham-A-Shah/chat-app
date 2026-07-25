import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';
import { ChatMessage } from '../../types';

import './Messages.css';

type MessagesProps = {
  messages: ChatMessage[];
  name: string;
};

const Messages = ({ messages, name }: MessagesProps) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </ScrollToBottom>
);

export default Messages;
