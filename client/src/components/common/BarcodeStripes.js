import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

/**
 * High-Fidelity SVG Barcode Component for Flight Tickets
 * Emulates authentic Code 128 / Boarding Pass barcode geometry
 */
export default function BarcodeStripes({
  code = 'VN-8X2K9P',
  color = '#0E1B2C',
  bgColor = '#FFFFFF',
  height = 46,
  style,
}) {
  // Bar patterns: [xOffset, width]
  const bars = [
    [4, 3], [10, 2], [14, 5], [22, 2], [26, 4], [33, 1], [36, 6], [45, 2],
    [50, 4], [56, 1], [60, 3], [66, 6], [75, 2], [80, 4], [87, 2], [92, 5],
    [100, 2], [105, 4], [112, 1], [116, 6], [125, 3], [131, 2], [136, 4], [143, 2],
    [148, 5], [156, 2], [161, 4], [168, 1], [172, 6], [181, 3], [187, 2], [192, 4],
    [199, 2], [204, 5], [212, 2], [217, 4], [224, 1], [228, 6], [237, 3], [243, 2],
    [248, 4], [255, 2], [260, 5], [268, 2], [273, 4], [280, 1], [284, 6], [293, 3],
    [299, 2], [304, 4], [311, 3],
  ];

  return (
    <View testID="ticket-barcode-stripes" style={[styles.container, { backgroundColor: bgColor }, style]}>
      <Svg width="100%" height={height} viewBox="0 0 320 46" preserveAspectRatio="none">
        <G fill={color}>
          {bars.map(([x, w], index) => (
            <Rect key={index} x={x} y={0} width={w} height={38} />
          ))}
        </G>
      </Svg>
      <Text style={[styles.codeText, { color }]}>* {code} *</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
    textAlign: 'center',
  },
});
