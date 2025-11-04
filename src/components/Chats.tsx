import { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Search, 
  Star, 
  MoreVertical, 
  ChevronDown,
  Send,
  Plus,
  Smile,
  Mic,
  ThumbsUp,
  Play
} from 'lucide-react'

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
  starred?: boolean
}

interface Message {
  id: string
  text: string
  time: string
  sender: 'user' | 'client'
  type?: 'text' | 'voice'
  duration?: string
}

export function Chats() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Ammi Watts',
      avatar: 'AW',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: false
    },
    {
      id: '2',
      name: 'Jennifer Markus',
      avatar: 'JM',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: true
    },
    {
      id: '3',
      name: 'Iva Ryan',
      avatar: 'IR',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: true
    },
    {
      id: '4',
      name: 'Jerry Helfer',
      avatar: 'JH',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: true
    },
    {
      id: '5',
      name: 'David Elson',
      avatar: 'DE',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: true
    },
    {
      id: '6',
      name: 'Mary Freund',
      avatar: 'MF',
      lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      time: 'Today | 05:30 PM',
      starred: true
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      text: "Oh, hello! All perfectly.",
      time: '04:45 PM',
      sender: 'client'
    },
    {
      id: '2',
      text: "I will check it and get back to you soon",
      time: '04:45 PM',
      sender: 'client'
    },
    {
      id: '3',
      text: "Oh, hello! All perfectly.",
      time: '04:45 PM',
      sender: 'client'
    },
    {
      id: '4',
      text: "I will check it and get back to you soon",
      time: '04:45 PM',
      sender: 'client'
    },
    {
      id: '5',
      text: "Oh, hello! All perfectly.",
      time: '04:45 PM',
      sender: 'user'
    },
    {
      id: '6',
      text: "I will check it and get back to you soon",
      time: '04:45 PM',
      sender: 'user'
    },
    {
      id: '7',
      text: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
      time: '04:45 PM',
      sender: 'user'
    },
    {
      id: '8',
      type: 'voice',
      text: '',
      duration: '01:24',
      time: '04:45 PM',
      sender: 'client'
    }
  ]

  const currentChat = chats.find(c => c.id === selectedChat)

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Chat List */}
      <div className="w-96 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2>Chats</h2>
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center space-x-2 text-sm">
              <span>All Messages</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button>
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search or start a new chat"
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors border-b ${
                selectedChat === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <Avatar className="w-10 h-10 bg-gray-700">
                <AvatarFallback className="text-white text-sm">
                  {chat.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium truncate">{chat.name}</h4>
                  {chat.starred && (
                    <Star className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate mb-1">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{chat.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {currentChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 bg-gray-700">
                <AvatarFallback className="text-white text-sm">
                  {currentChat.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{currentChat.name}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Star className={`w-5 h-5 ${currentChat.starred ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-xs text-gray-500">Today | 08:33 PM</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.type === 'voice' ? (
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <button className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        msg.sender === 'user' ? 'bg-blue-500' : 'bg-white'
                      }`}>
                        <Play className="w-3 h-3" />
                      </button>
                      <div className="flex-1">
                        <div className={`h-6 flex items-center space-x-0.5 ${
                          msg.sender === 'user' ? 'opacity-80' : ''
                        }`}>
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-0.5 rounded-full ${
                                msg.sender === 'user' ? 'bg-white' : 'bg-blue-600'
                              }`}
                              style={{ height: `${Math.random() * 16 + 8}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-medium">{msg.duration}</span>
                    </div>
                  ) : (
                    <div className={`px-4 py-2 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 px-2">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t p-4">
            <div className="flex items-end space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
              
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center space-x-2">
                <Input
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0 px-0"
                />
                <button className="text-blue-600 hover:bg-blue-50 rounded-lg p-1">
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Mic className="w-5 h-5" />
              </button>
              
              <button className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}