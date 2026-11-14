import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNotificationStore } from '../../stores/notification.store';
import { useThemeStore } from '../../stores/theme.store';

export default function NotificationModal({ visible, onClose }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationStore();

  const getIconForType = (type) => {
    switch (type) {
      case 'EXPENSE':
        return '💰';
      case 'FLIGHT':
        return '✈️';
      case 'TRIP':
        return '🗺️';
      case 'SETTLEMENT':
        return '✅';
      default:
        return '🔔';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop} testID="notification-modal">
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
              borderColor: isDark ? '#2A2D35' : '#E5E7EB',
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <View style={styles.headerTitleRow}>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                testID="btn-mark-all-read"
                onPress={markAllAsRead}
                style={styles.markReadBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.markReadText, { color: themeColors.primary || '#0284C7' }]}>
                  Mark all as read
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2D35' : '#F3F4F6' }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  No notifications yet
                </Text>
              </View>
            ) : (
              notifications.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  testID={`notification-item-${item.id}`}
                  style={[
                    styles.item,
                    {
                      backgroundColor: item.read
                        ? 'transparent'
                        : isDark
                        ? '#22252B'
                        : '#F0F9FF',
                      borderBottomColor: isDark ? '#2A2D35' : '#F3F4F6',
                    },
                  ]}
                  onPress={() => markAsRead(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemIconContainer}>
                    <Text style={styles.itemIcon}>{getIconForType(item.type)}</Text>
                  </View>
                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text
                        style={[
                          styles.itemTitle,
                          {
                            color: isDark ? '#FFFFFF' : '#111827',
                            fontWeight: item.read ? '500' : '700',
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={[styles.timestamp, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {item.timestamp}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.message,
                        { color: isDark ? '#D1D5DB' : '#4B5563' },
                      ]}
                      numberOfLines={2}
                    >
                      {item.message}
                    </Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 380,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  itemIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemIcon: {
    fontSize: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
    marginLeft: 6,
  },
});
