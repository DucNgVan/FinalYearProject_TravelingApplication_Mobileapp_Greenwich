import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSupportStore } from '../../stores/support.store';
import { useThemeStore } from '../../stores/theme.store';

export default function LiveSupportChatModal({ visible, ticketId = 'ticket-1001', onClose }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';

  const { messagesByTicket, sendMessage } = useSupportStore();
  const messages = messagesByTicket[ticketId] || [
    {
      id: 'm-default-1',
      senderRole: 'ADMIN',
      senderName: 'Alex Danvers (Support Desk)',
      message: 'Hello! I am Alex from the Nomadix Priority Support team. How can I help you today?',
      createdAt: 'Just now',
    },
  ];

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(ticketId, inputText.trim());
    setInputText('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.backdrop} testID="live-support-chat-modal">
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
              <View style={styles.agentInfoRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AD</Text>
                  <View style={styles.onlineBadge} />
                </View>
                <View>
                  <Text style={[styles.agentName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    Alex Danvers
                  </Text>
                  <Text style={styles.agentStatus}>● Active now • Priority Support</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: isDark ? '#2A2D35' : '#F3F4F6' }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages Scroll View */}
            <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
              {messages.map((item, idx) => {
                const isUser = item.senderRole === 'USER';
                return (
                  <View
                    key={item.id || idx}
                    style={[
                      styles.messageBubbleWrapper,
                      isUser ? styles.userBubbleAlign : styles.agentBubbleAlign,
                    ]}
                  >
                    {!isUser && (
                      <Text style={[styles.senderNameLabel, { color: themeColors.textMuted }]}>
                        {item.senderName || 'Support Specialist'}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.messageBubble,
                        isUser
                          ? [
                              styles.userBubble,
                              { backgroundColor: isDark ? '#0284C7' : '#0E1B2C' },
                            ]
                          : [
                              styles.agentBubble,
                              {
                                backgroundColor: isDark ? '#22252B' : '#F1F5F9',
                                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                              },
                            ],
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          { color: isUser ? '#FFFFFF' : isDark ? '#FFFFFF' : '#111827' },
                        ]}
                      >
                        {item.message}
                      </Text>
                    </View>
                    <Text style={[styles.timestamp, { color: themeColors.textMuted }]}>
                      {item.createdAt || 'Just now'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Bottom Message Input Bar */}
            <View
              style={[
                styles.inputBar,
                {
                  borderTopColor: isDark ? '#2A2D35' : '#E5E7EB',
                  backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                },
              ]}
            >
              <TextInput
                placeholder="Type your message to support..."
                placeholderTextColor={themeColors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#121316' : '#F8FAFC',
                    color: isDark ? '#FFFFFF' : '#111827',
                    borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                  },
                ]}
              />

              <TouchableOpacity
                testID="btn-send-live-chat"
                onPress={handleSend}
                style={[
                  styles.sendBtn,
                  { backgroundColor: isDark ? '#0284C7' : '#0E1B2C' },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.sendBtnText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  agentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0E1B2C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 13,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  agentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  agentStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 1,
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
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleWrapper: {
    marginBottom: 12,
    maxWidth: '82%',
  },
  userBubbleAlign: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  agentBubbleAlign: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderNameLabel: {
    fontSize: 10,
    marginBottom: 3,
    marginLeft: 4,
    fontWeight: '600',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 13,
    borderWidth: 1,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
