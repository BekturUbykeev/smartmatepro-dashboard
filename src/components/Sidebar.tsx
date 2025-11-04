import { Zap, MessageSquare, LayoutDashboard, Calendar, Share2 } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export function Sidebar({ activeItem = 'Business Setup', onNavigate }: SidebarProps) {
  const menuItems = [
    { icon: Zap, label: 'Business Setup', active: true },
    { icon: MessageSquare, label: 'Chats', active: false },
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Share2, label: 'Integrations', active: false },
  ];

  return (
    <div className="w-[240px] bg-black border-r border-white/10 flex flex-col py-8 px-4">
      {/* Logo */}
      <div className="mb-12 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0066FF] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base leading-tight text-white">SmartMate</span>
            <span className="text-xs text-gray-400 leading-tight">Professional</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;
          
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm",
                isActive 
                  ? "bg-[#0066FF] text-white" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-left text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <button className="w-full px-4 py-3 bg-[#0066FF] hover:bg-[#0052CC] rounded-lg transition-colors group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium">Get Premium</span>
            <Zap className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xs text-white/80 text-left">Unlock all features</div>
        </button>
      </div>
    </div>
  );
}
