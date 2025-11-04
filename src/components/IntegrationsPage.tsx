import { Check, Plus, Send, MessageCircle, MessagesSquare, Smartphone, Mail, Hash, Gamepad2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  connected: boolean;
}

const integrations: Integration[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Connect your Telegram bot to automate conversations',
    icon: Send,
    iconColor: '#0088cc',
    bgColor: 'bg-blue-50',
    connected: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Integrate WhatsApp Business API',
    icon: MessageCircle,
    iconColor: '#25D366',
    bgColor: 'bg-green-50',
    connected: true,
  },
  {
    id: 'messenger',
    name: 'Messenger',
    description: 'Connect Facebook Messenger',
    icon: MessagesSquare,
    iconColor: '#0084FF',
    bgColor: 'bg-blue-50',
    connected: false,
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'Send automated SMS notifications',
    icon: Smartphone,
    iconColor: '#5B7C99',
    bgColor: 'bg-slate-50',
    connected: true,
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Automate email campaigns',
    icon: Mail,
    iconColor: '#EA4335',
    bgColor: 'bg-red-50',
    connected: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified in Slack channels',
    icon: Hash,
    iconColor: '#4A154B',
    bgColor: 'bg-purple-50',
    connected: false,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Manage bookings via Discord',
    icon: Gamepad2,
    iconColor: '#5865F2',
    bgColor: 'bg-indigo-50',
    connected: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Respond to Instagram DMs',
    icon: Camera,
    iconColor: '#E4405F',
    bgColor: 'bg-pink-50',
    connected: false,
  },
];

export function IntegrationsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl mb-2">Integrations</h1>
        <p className="text-sm text-gray-500">Connect your favorite platforms</p>
      </div>

      {/* Integrations List */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div 
            key={integration.id} 
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300 flex items-center gap-4"
          >
            {/* Icon - Minimal Style */}
            <div className={`w-14 h-14 rounded-xl ${integration.bgColor} flex items-center justify-center shrink-0`}>
              <integration.icon 
                className="w-6 h-6" 
                style={{ color: integration.iconColor }}
                strokeWidth={1.5} 
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base mb-0.5">{integration.name}</h3>
              <p className="text-sm text-gray-500">{integration.description}</p>
            </div>

            {/* Status & Action */}
            <div className="flex items-center gap-3 shrink-0">
              {integration.connected ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-700">Connected</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 rounded-full text-sm h-9"
                  >
                    Settings
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full text-sm h-9 px-4 hover:shadow-md hover:shadow-[#0066FF]/20"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Card */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-base mb-2">Need help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Check our documentation or contact support for assistance with integrations.
        </p>
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full hover:shadow-md hover:shadow-[#0066FF]/20"
          >
            Documentation
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 rounded-full"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
