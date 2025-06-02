'use client';

import { Bell, X } from "lucide-react";
import { useNotificationsContext } from "@/context/NotificationsContext";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotificationDropdown({ isOpen, onToggle }: NotificationDropdownProps) {
  const { notifications, dismiss, isLoading } = useNotificationsContext();

  return (
    <div className="relative">
      {/* Notification button */}
      <button
        onClick={onToggle}
        className="relative p-2 rounded-full hover:bg-blue-100/50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-500" />
        {!isLoading && notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-96 max-h-[85vh] overflow-hidden bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
            <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
          </div>
          
          <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-center">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-center">No new notifications</p>
                <p className="text-gray-400 text-sm text-center">We&apos;ll notify you when something arrives</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="group relative flex items-start gap-4 p-4 hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 mb-0.5">{n.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{n.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 absolute right-4 top-4 p-1 rounded-full hover:bg-white transition-all duration-200"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {!isLoading && notifications.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
              <button 
                onClick={() => notifications.forEach(n => dismiss(n.id))}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-1 rounded-lg hover:bg-blue-50/50 transition-colors duration-200"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 