import { motion } from 'motion/react';
import { Bell, MessageSquare, Mail, Smartphone, X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3AINotifications({ onNext, onBack }: Step3Props) {
  const [notificationChannel, setNotificationChannel] = useState<'email' | 'sms' | null>('email');
  const [conversationTone, setConversationTone] = useState<'friendly' | 'professional' | 'casual' | 'formal'>('friendly');
  const [appointmentReminder, setAppointmentReminder] = useState<'none' | '2hours' | '12hours' | '24hours' | '48hours'>('24hours');
  
  // Custom Instructions tags
  const [customInstructions, setCustomInstructions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // Predefined example phrases
  const examplePhrases = [
    "Don't take reservations on Tuesday",
    "Always ask about comparisons",
    "Proactively discuss care and keep it warm",
    "Mention seasonal specials",
    "Ask about dietary restrictions",
    "Confirm contact details"
  ];
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !customInstructions.includes(trimmedTag)) {
      setCustomInstructions([...customInstructions, trimmedTag]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setCustomInstructions(customInstructions.filter(tag => tag !== tagToRemove));
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
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
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">AI & Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">Chat behavior and alerts</p>
        </div>
      </div>

      {/* AI Chat Behavior */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-start gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <h3 className="text-base">AI Chat Behavior</h3>
        </div>

        <div className="space-y-4">
          {/* Conversation Tone */}
          <div className="space-y-3">
            <label className="text-sm text-gray-700">Conversation Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'professional' as const, label: 'Professional', description: 'polite and concise' },
                { value: 'friendly' as const, label: 'Friendly', description: 'approachable and conversational' },
                { value: 'casual' as const, label: 'Casual', description: 'relaxed and natural' },
                { value: 'formal' as const, label: 'Formal', description: 'respectful and precise' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConversationTone(option.value)}
                  className={`flex flex-col items-start px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    conversationTone === option.value
                      ? 'border-[#0066FF] bg-[#E6F0FF]'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${conversationTone === option.value ? 'text-[#0066FF]' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                  <span className={`text-xs mt-0.5 ${conversationTone === option.value ? 'text-[#0066FF]/70' : 'text-gray-500'}`}>
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instructions - Highlighted */}
          <div className="space-y-3 bg-gradient-to-br from-[#E6F0FF]/50 to-purple-50/30 border border-[#0066FF]/30 rounded-xl p-5 hover:border-[#0066FF]/50 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-gray-900">Custom Instructions</label>
              <span className="px-2 py-0.5 bg-[#0066FF] text-white text-xs rounded-full">Featured</span>
            </div>
            
            {/* Selected Tags */}
            {customInstructions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customInstructions.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#0066FF]/40 rounded-lg text-sm text-[#0066FF]"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-[#E6F0FF] rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Input Field */}
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a custom instruction and press Enter..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#0066FF] transition-all hover:border-gray-300"
              />
            </div>
            
            {/* Example Phrases */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Quick add suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {examplePhrases.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => addTag(phrase)}
                    disabled={customInstructions.includes(phrase)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      customInstructions.includes(phrase)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:text-[#0066FF] hover:bg-[#E6F0FF] hover:border-[#0066FF]'
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Follow-ups */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-start gap-3 mb-6">
          <Bell className="w-5 h-5 text-[#0066FF] mt-0.5" />
          <div>
            <h3 className="text-base">Notifications & Follow-ups</h3>
            <p className="text-sm text-gray-600 mt-1">
              Specialist receives notifications only for complex or disputed cases requiring personal involvement
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Channels */}
          <div className="space-y-3">
            <label className="text-sm text-gray-700">Notification Channels</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNotificationChannel(notificationChannel === 'email' ? null : 'email')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  notificationChannel === 'email'
                    ? 'border-[#0066FF] bg-[#0066FF] shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Mail className={`w-4 h-4 ${notificationChannel === 'email' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`text-sm ${notificationChannel === 'email' ? 'text-white' : 'text-gray-700'}`}>
                  Email
                </span>
              </button>

              <button
                onClick={() => setNotificationChannel(notificationChannel === 'sms' ? null : 'sms')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  notificationChannel === 'sms'
                    ? 'border-[#0066FF] bg-[#0066FF] shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Smartphone className={`w-4 h-4 ${notificationChannel === 'sms' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`text-sm ${notificationChannel === 'sms' ? 'text-white' : 'text-gray-700'}`}>
                  SMS
                </span>
              </button>
            </div>
          </div>

          {/* Appointment Reminders */}
          <div className="space-y-3">
            <label className="text-sm text-gray-700">Appointment Reminders</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'none' as const, label: 'None' },
                { value: '2hours' as const, label: '2 hours' },
                { value: '12hours' as const, label: '12 hours' },
                { value: '24hours' as const, label: '24 hours' },
                { value: '48hours' as const, label: '48 hours' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAppointmentReminder(option.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    appointmentReminder === option.value
                      ? 'border-[#0066FF] bg-[#0066FF] text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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
