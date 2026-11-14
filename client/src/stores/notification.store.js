import { create } from 'zustand';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Squad Expense Added',
    message: 'Duc added Seafood Dinner at Bé Mặn (1,850,000 ₫).',
    type: 'EXPENSE',
    read: false,
    timestamp: '10m ago',
  },
  {
    id: 'notif-2',
    title: 'Flight Status Alert',
    message: 'VN128 SGN → DAD is on schedule for 14:15 departure.',
    type: 'FLIGHT',
    read: false,
    timestamp: '1h ago',
  },
  {
    id: 'notif-3',
    title: 'Itinerary Updated',
    message: 'Sarah added Marble Mountains to Day 2 stops.',
    type: 'TRIP',
    read: false,
    timestamp: '3h ago',
  },
  {
    id: 'notif-4',
    title: 'Settlement Completed',
    message: 'Alex settled up 450,000 ₫ via VietQR transfer.',
    type: 'SETTLEMENT',
    read: true,
    timestamp: '1d ago',
  },
];

export const useNotificationStore = create((set, get) => ({
  notifications: DEFAULT_NOTIFICATIONS,
  unreadCount: DEFAULT_NOTIFICATIONS.filter((n) => !n.read).length,

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  addNotification: (notification) => {
    set((state) => {
      const newItem = {
        id: notification.id || `notif-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'INFO',
        read: false,
        timestamp: 'Just now',
        ...notification,
      };
      const updated = [newItem, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  resetNotifications: () => {
    set({
      notifications: DEFAULT_NOTIFICATIONS,
      unreadCount: DEFAULT_NOTIFICATIONS.filter((n) => !n.read).length,
    });
  },
}));
