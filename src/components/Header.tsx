import { Search, Bell, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
  /** Показать строку поиска (по умолчанию да). На календаре выключаем. */
  showSearch?: boolean;
  /** Компактная шапка: ниже высота и отступы. Опционально. */
  compact?: boolean;
};

export function Header({ showSearch = true, compact = false }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const barClasses = compact
    ? 'h-12 px-4'  // компактная
    : 'h-16 px-6'; // обычная

  return (
    <div className={`${barClasses} bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40`}>
      {/* Search */}
      <div className="flex-1 max-w-md">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-all">
          <Settings className="w-5 h-5 text-gray-700" />
        </button>

        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-all">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0066FF] rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-2 pr-2 py-1.5 hover:bg-gray-50 rounded-lg transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">JW</div>
            <div className="flex flex-col items-start mr-1">
              <span className="text-xs leading-tight text-black">John Willson</span>
              <span className="text-[11px] text-gray-400 leading-tight">User</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50">Pricing</button>
                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50">Support</button>
                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50">Settings</button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Log Out</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
