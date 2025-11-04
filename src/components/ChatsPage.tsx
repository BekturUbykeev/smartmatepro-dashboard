import { useState } from 'react';
import { Search, MoreVertical, Star, Send, Paperclip, Smile, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Chat {
  id: number;
  initial: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  starred?: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  time: string;
  source?: 'telegram' | 'whatsapp' | 'messenger' | 'sms';
}

const chats: Chat[] = [
  { id: 1, initial: 'AM', name: 'Alex Martinez', preview: 'Looking to book a haircut t...', time: '2m', unread: 2 },
  { id: 2, initial: 'SC', name: 'Sarah Chen', preview: 'Thank you for the great service!', time: '15m' },
  { id: 3, initial: 'MB', name: 'Michael Brown', preview: 'Can I reschedule my appoint...', time: '1h', starred: true },
  { id: 4, initial: 'EW', name: 'Emma Wilson', preview: 'What time slots are available?', time: '3h' },
  { id: 5, initial: 'JT', name: 'James Taylor', preview: 'Perfect, see you tomorrow', time: '5h' },
  { id: 6, initial: 'LA', name: 'Lisa Anderson', preview: 'Is there parking nearby?', time: '1d' },
];

const initialMessages: Message[] = [
  { id: 1, text: "Hi! I'd like to book a haircut", sender: 'user', time: '2:45 PM', source: 'telegram' },
  { id: 2, text: 'Of course! What day works best for you?', sender: 'assistant', time: '2:46 PM' },
  { id: 3, text: 'This Friday afternoon if possible', sender: 'user', time: '2:47 PM', source: 'whatsapp' },
  { id: 4, text: 'Friday at 3pm or 4pm available?', sender: 'assistant', time: '2:47 PM' },
  { id: 5, text: '3pm works perfectly!', sender: 'user', time: '2:48 PM', source: 'messenger' },
  { id: 6, text: "Great! I've booked you for Friday at 3pm. See you then!", sender: 'assistant', time: '2:48 PM' },
];

export function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="h-full flex bg-white">
      {/* Chat List Sidebar */}
      <div className="w-[280px] border-r border-gray-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-black">Chats</h2>
            <button className="p-1 hover:bg-gray-50 rounded">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search" 
              className="pl-9 bg-gray-50 border border-gray-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-all duration-300 border-b border-gray-100 text-left ${
                selectedChat.id === chat.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#0066FF] shrink-0 text-sm">
                {chat.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm truncate text-black">{chat.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 truncate flex-1">{chat.preview}</p>
                  {chat.unread && (
                    <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white border-0 rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs px-1.5">
                      {chat.unread}
                    </Badge>
                  )}
                  {chat.starred && (
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400 shrink-0" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base text-black">{selectedChat.name}</h3>
            <p className="text-xs text-gray-400">Active now</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-50 rounded">
              <Star className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center mb-8">
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
                Today
              </span>
            </div>

            {messages.map((message) => {
              const getSourceIcon = (source?: string) => {
                switch (source) {
                  case 'telegram':
                    return (
                      <div className="w-5 h-5 rounded-full bg-[#0088cc] flex items-center justify-center text-white text-xs">
                        T
                      </div>
                    );
                  case 'whatsapp':
                    return (
                      <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs">
                        W
                      </div>
                    );
                  case 'messenger':
                    return (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00B2FF] to-[#006AFF] flex items-center justify-center text-white text-xs">
                        M
                      </div>
                    );
                  case 'sms':
                    return (
                      <div className="w-5 h-5 rounded-full bg-[#5B7C99] flex items-center justify-center text-white text-xs">
                        S
                      </div>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === 'assistant' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'user' && message.source && (
                    <div className="flex items-end pb-6">
                      {getSourceIcon(message.source)}
                    </div>
                  )}
                  <div className={`max-w-[70%] ${message.sender === 'assistant' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        message.sender === 'assistant'
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-white text-black border border-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div
                      className={`text-xs text-gray-400 mt-1 px-1 ${
                        message.sender === 'assistant' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <button className="p-1 hover:bg-white rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              />
              <button className="p-1 hover:bg-white rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="rounded-full w-9 h-9 bg-black hover:bg-gray-800 text-white ml-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
