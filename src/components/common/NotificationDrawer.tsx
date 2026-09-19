import React from 'react';
import { Bell, CheckCheck, X, AlertTriangle, CheckCircle2, Megaphone, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentRole,
    setActiveTab,
    setActiveRequestIdForMatching,
  } = useApp();

  if (!isOpen) return null;

  // Filter notifications for current user / relevant role
  const userNotifs = notifications.filter(
    (n) => n.user_id === currentUser.id || n.type === 'EMERGENCY_REQUEST' || n.type === 'MATCH_ACCEPTED'
  );

  const unreadCount = userNotifs.filter((n) => n.status === 'UNREAD').length;

  const handleActionClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'EMERGENCY_REQUEST') {
      setCurrentRole('DONOR');
      setActiveTab('dashboard');
    } else if (notif.type === 'MATCH_ACCEPTED') {
      setCurrentRole('HOSPITAL');
      setActiveTab('matching');
      if (notif.request_id) {
        setActiveRequestIdForMatching(notif.request_id);
      }
    } else if (notif.type === 'OUTREACH_CAMPAIGN') {
      setCurrentRole('DONOR');
      setActiveTab('dashboard');
    }
    onClose();
  };

  return (
    <div id="notification-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        id="notification-drawer-panel"
        className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread emergency notices` : 'All caught up'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-slate-600 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-slate-100 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-10 h-10 mb-2 opacity-30" />
              <p className="font-medium text-slate-600 text-sm">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">Emergency requests and donor matches will appear here in real-time.</p>
            </div>
          ) : (
            userNotifs.map((notif) => {
              const isUnread = notif.status === 'UNREAD';
              return (
                <div
                  key={notif.id}
                  id={`notif-card-${notif.id}`}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUnread
                      ? 'bg-red-50/50 border-red-200/80 shadow-xs'
                      : 'bg-white border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'EMERGENCY_REQUEST' && (
                        <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'MATCH_ACCEPTED' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'OUTREACH_CAMPAIGN' && (
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                          <Megaphone className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'SYSTEM' && (
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                      
                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Just now
                        </span>
                        <button
                          onClick={() => handleActionClick(notif)}
                          className="font-semibold text-red-600 hover:text-red-700 hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Simulated instant push & SMS dispatcher active
        </div>
      </div>
    </div>
  );
};
