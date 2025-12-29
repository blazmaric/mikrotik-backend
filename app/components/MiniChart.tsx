import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface MiniChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export default function MiniChart({ 
  data, 
  color = COLORS.primary.main,
  height = 60 
}: MiniChartProps) {
  const width = Dimensions.get('window').width - 64;

  if (data.length < 2) {
    return <View style={[styles.container, { height }]} />;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((point.value - minValue) / range) * height;
    return { x, y };
  });

  const pathData = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    const prevPoint = points[index - 1];
    const cpX = (prevPoint.x + point.x) / 2;
    return `${acc} Q ${cpX} ${prevPoint.y}, ${cpX} ${(prevPoint.y + point.y) / 2} Q ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = `${pathData} L ${width} ${height} L 0 ${height} Z`;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        <Path
          d={areaPath}
          fill="url(#gradient)"
        />
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
