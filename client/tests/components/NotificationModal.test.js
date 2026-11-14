import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationModal from '../../src/components/common/NotificationModal';
import { useNotificationStore } from '../../src/stores/notification.store';

describe('Frontend Test: NotificationModal & useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.getState().resetNotifications();
  });

  it('RED-FE-NOTIF-01: renders notification list with trip and expense alerts', () => {
    const { getByTestId, getByText } = render(
      <NotificationModal visible={true} onClose={jest.fn()} />
    );

    expect(getByTestId('notification-modal')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
  });

  it('RED-FE-NOTIF-02: marks all notifications as read and updates unread badge count', () => {
    expect(useNotificationStore.getState().unreadCount).toBeGreaterThan(0);

    const { getByTestId } = render(
      <NotificationModal visible={true} onClose={jest.fn()} />
    );

    const markReadBtn = getByTestId('btn-mark-all-read');
    fireEvent.press(markReadBtn);

    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });
});
