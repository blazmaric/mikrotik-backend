import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Mail, Send, X } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { SmsMessage } from '@/app/types/mikrotik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mikrotikApi } from '@/app/services/mikrotik';

interface SmsInboxCardProps {
  messages: SmsMessage[];
}

export default function SmsInboxCard({ messages }: SmsInboxCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const sendSmsMutation = useMutation({
    mutationFn: ({ phoneNumber, message }: { phoneNumber: string; message: string }) =>
      mikrotikApi.sendSms(phoneNumber, message),
    onSuccess: () => {
      Alert.alert('Success', 'SMS sent successfully');
      setModalVisible(false);
      setPhoneNumber('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Error sending SMS:', error);
      Alert.alert('Error', 'Failed to send SMS');
    },
  });

  const handleSendSms = () => {
    if (!phoneNumber.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    sendSmsMutation.mutate({ phoneNumber, message });
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Mail size={20} color={COLORS.primary.main} />
            <Text style={styles.title}>SMS Inbox ({messages.length})</Text>
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => setModalVisible(true)}
          >
            <Send size={16} color={COLORS.text.primary} />
            <Text style={styles.sendButtonText}>Send SMS</Text>
          </TouchableOpacity>
        </View>
        {messages.length === 0 ? (
          <Text style={styles.emptyText}>No messages</Text>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={styles.messageRow}>
              <View style={styles.messageHeader}>
                <Text style={styles.sender}>{msg.sender}</Text>
                <Text style={styles.time}>{msg.time}</Text>
              </View>
              <Text style={styles.message}>{msg.message}</Text>
            </View>
          ))
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send SMS</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+386 XX XXX XXX"
                placeholderTextColor={COLORS.text.disabled}
                keyboardType="phone-pad"
                editable={!sendSmsMutation.isPending}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your message..."
                placeholderTextColor={COLORS.text.disabled}
                multiline
                numberOfLines={4}
                editable={!sendSmsMutation.isPending}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={sendSmsMutation.isPending}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSendSms}
                disabled={sendSmsMutation.isPending}
              >
                {sendSmsMutation.isPending ? (
                  <ActivityIndicator size="small" color={COLORS.text.primary} />
                ) : (
                  <>
                    <Send size={16} color={COLORS.text.primary} />
                    <Text style={styles.confirmButtonText}>Send</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  sendButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  messageRow: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.cardBorder,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  sender: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.disabled,
    textAlign: 'center' as const,
    paddingVertical: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top' as const,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  cancelButton: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.secondary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary.main,
  },
  confirmButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
});
