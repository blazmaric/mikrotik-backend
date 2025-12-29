import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';

interface ProgressCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  maxValue?: number;
}

export default function ProgressCard({ 
  title, 
  value, 
  icon: Icon, 
  color = COLORS.primary.main,
  maxValue = 100 
}: ProgressCardProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: value,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [value, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, maxValue],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const getColor = () => {
    if (value < 50) return COLORS.success;
    if (value < 75) return COLORS.warning;
    return COLORS.error;
  };

  const progressColor = getColor();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}%</Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: widthInterpolated,
              backgroundColor: progressColor,
            }
          ]} 
        />
      </View>
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
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
});
