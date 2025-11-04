import { motion, AnimatePresence } from 'motion/react';
import { Zap, Info, Calendar, MessageSquare, Rocket, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useRef, useEffect } from 'react';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

export function Step4TestLaunch({ onNext, onBack }: Step4Props) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "I'd like to book a haircut for today",
    "What services do you offer?",
    "What are your working hours?",
    "Can I book for next Tuesday at 3pm?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        response = "Hi! Sure thing — let me check today's availability for a Classic Haircut. We are open till 5:00 PM and available from 2:00 PM till 5:00 PM. Would you like me to book you at 2:00 PM or later in the afternoon?";
      } else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        response = "We offer several services: Classic Haircut ($50), Beard Trim & Shape ($30), and Deluxe Grooming ($80). Which service are you interested in?";
      } else if (lowerMessage.includes('hour') || lowerMessage.includes('open')) {
        response = "We're open Monday to Friday from 8:00 AM to 5:00 PM. We're closed on weekends. Would you like to book an appointment?";
      } else if (lowerMessage.includes('3') || lowerMessage.includes('pm')) {
        response = "Perfect! You're all set for a Classic Haircut at 3:00 PM with John Doe. You'll get a reminder 24 hours before the appointment. Looking forward to seeing you!";
      } else {
        response = "Thanks for reaching out! I'm your AI assistant for Shark Barber Shop. How can I help you today? You can ask about our services, book an appointment, or check our availability.";
      }
      
      setChatMessages(prev => [...prev, { type: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', text: inputValue }]);
      simulateAIResponse(inputValue);
      setInputValue('');
    }
  };

  const handlePromptClick = (prompt: string) => {
    setChatMessages(prev => [...prev, { type: 'user', text: prompt }]);
    simulateAIResponse(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Step Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">Test & Launch</h2>
          <p className="text-sm text-gray-600 mt-1">Test and go live</p>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-start gap-3 mb-6">
          <Info className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <div>
            <h3 className="text-base">Overview</h3>
            <p className="text-xs text-gray-500 mt-1">Quick summary of your setup</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Business Data Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 cursor-pointer group hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#E6F0FF] flex items-center justify-center group-hover:bg-[#0066FF] transition-colors">
                <Info className="w-5 h-5 text-[#0066FF] group-hover:text-white transition-colors" />
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h4 className="text-sm mb-3 text-gray-900">Business Data</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Shark Barber Shop</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>shark@barber.com</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>San Francisco, CA</p>
              </div>
            </div>
          </motion.div>

          {/* Services & Booking Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 cursor-pointer group hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Calendar className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h4 className="text-sm mb-3 text-gray-900">Services & Booking</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>3 services - $50 avg</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Mon-Fri: 8am - 5pm</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Max booking: 1 month</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Same-day booking enabled</p>
              </div>
            </div>
          </motion.div>

          {/* AI Behavior Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 cursor-pointer group hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <MessageSquare className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h4 className="text-sm mb-3 text-gray-900">AI Behavior</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Tone: Friendly</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>Email notifications</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <p>24h reminders enabled</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Test Your Setup */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-start gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base">Test Your Setup</h3>
            <p className="text-sm text-gray-600 mt-1">
              Try a sample chat to make sure your assistant works as expected
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-5 h-5 text-blue-600" />
          </motion.div>
        </div>

        {/* Chat Interface */}
        <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {chatMessages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#E6F0FF] flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-[#0066FF]" />
                    </div>
                    <p className="text-sm text-gray-600">Start a conversation to test your AI assistant</p>
                    <p className="text-xs text-gray-500 mt-1">Try one of the prompts below</p>
                  </div>
                </motion.div>
              )}
              
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                      message.type === 'user'
                        ? 'bg-[#0066FF] text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 pb-3 flex gap-2 flex-wrap"
            >
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-[#E6F0FF]/30 transition-all"
                >
                  {prompt}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#0066FF] hover:bg-[#0052CC] px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Your Assistant */}
      <motion.div
        whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl p-6 text-white"
      >
        <div className="flex items-start gap-3 mb-4">
          <Rocket className="w-5 h-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base">Launch Your Assistant</h3>
            <p className="text-sm text-white/80 mt-1">
              Activate the assistant to start real conversations with clients
            </p>
          </div>
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => {
              setIsLaunched(true);
              setTimeout(() => onNext(), 1000);
            }}
            disabled={isLaunched}
            className="w-full h-14 bg-white text-[#0066FF] hover:bg-[#E6F0FF] text-base gap-2"
          >
            <Rocket className="w-5 h-5" />
            {isLaunched ? 'Launching...' : 'Go Live'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 bg-black text-white hover:bg-[#2A2A2A] hover:text-white border-black"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-8 bg-[#0066FF] hover:bg-[#0052CC]"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
