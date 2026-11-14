import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HelpSupportModal from '../../src/screens/account/HelpSupportModal';
import { useSupportStore } from '../../src/stores/support.store';

describe('Frontend Test: Tiered Support Journey (FAQ Self-Service First -> Live Chat Escalation)', () => {
  beforeEach(() => {
    useSupportStore.getState().resetSupport();
  });

  it('RED-SUP-TIER-01: renders FAQ knowledge base first and provides escalation button', () => {
    const { getByTestId, getByText } = render(
      <HelpSupportModal visible={true} onClose={jest.fn()} />
    );

    // FAQ section is visible
    expect(getByTestId('faq-toggle-faq-1')).toBeTruthy();
    expect(getByText(/How do I change or refund my flight ticket/i)).toBeTruthy();

    // Escalation trigger exists after FAQs
    const escalateBtn = getByTestId('btn-escalate-live-chat');
    expect(escalateBtn).toBeTruthy();
  });

  it('RED-SUP-TIER-02: tapping escalation trigger opens LiveSupportChatModal to chat with agent', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <HelpSupportModal visible={true} onClose={jest.fn()} />
    );

    // Trigger escalation
    const escalateBtn = getByTestId('btn-escalate-live-chat');
    fireEvent.press(escalateBtn);

    // Live chat modal is now visible
    expect(getByTestId('live-support-chat-modal')).toBeTruthy();
    expect(getByTestId('btn-send-live-chat')).toBeTruthy();

    // Send a message
    const chatInput = getByPlaceholderText(/Type your message|Nhập tin nhắn/i);
    fireEvent.changeText(chatInput, 'I need manual agent verification for my booking');

    const sendBtn = getByTestId('btn-send-live-chat');
    fireEvent.press(sendBtn);

    await waitFor(() => {
      const messages = useSupportStore.getState().messagesByTicket['ticket-1001'] || [];
      expect(
        messages.some((m) => m.message === 'I need manual agent verification for my booking')
      ).toBe(true);
    });
  });
});
