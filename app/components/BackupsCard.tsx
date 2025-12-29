import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Database, Download, Plus } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { Backup } from '@/app/types/mikrotik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mikrotikApi } from '@/app/services/mikrotik';

interface BackupsCardProps {
  backups: Backup[];
}

export default function BackupsCard({ backups }: BackupsCardProps) {
  const queryClient = useQueryClient();

  const createBackupMutation = useMutation({
    mutationFn: () => mikrotikApi.createBackup(),
    onSuccess: () => {
      Alert.alert('Success', 'Backup created successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Error creating backup:', error);
      Alert.alert('Error', 'Failed to create backup');
    },
  });

  const handleCreateBackup = () => {
    Alert.alert(
      'Create Backup',
      'Are you sure you want to create a new backup?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => createBackupMutation.mutate() },
      ]
    );
  };

  const handleDownloadBackup = (backup: Backup) => {
    Alert.alert('Download', `Download functionality for ${backup.name} will be implemented`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Database size={20} color={COLORS.primary.main} />
          <Text style={styles.title}>Backups ({backups.length})</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateBackup}
          disabled={createBackupMutation.isPending}
        >
          {createBackupMutation.isPending ? (
            <ActivityIndicator size="small" color={COLORS.text.primary} />
          ) : (
            <>
              <Plus size={16} color={COLORS.text.primary} />
              <Text style={styles.createButtonText}>Create</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      {backups.length === 0 ? (
        <Text style={styles.emptyText}>No backups available</Text>
      ) : (
        backups.map((backup, index) => (
          <View key={index} style={styles.backupRow}>
            <View style={styles.backupInfo}>
              <Text style={styles.backupName}>{backup.name}</Text>
              <Text style={styles.backupDate}>{backup.date}</Text>
            </View>
            <View style={styles.backupActions}>
              <Text style={styles.backupSize}>{backup.size}</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadBackup(backup)}
              >
                <Download size={16} color={COLORS.primary.main} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  createButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  backupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.cardBorder,
  },
  backupInfo: {
    flex: 1,
  },
  backupName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  backupDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  backupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backupSize: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    fontFamily: 'monospace' as const,
  },
  downloadButton: {
    padding: SPACING.sm,
    backgroundColor: `${COLORS.primary.main}20`,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.disabled,
    textAlign: 'center' as const,
    paddingVertical: SPACING.lg,
  },
});
