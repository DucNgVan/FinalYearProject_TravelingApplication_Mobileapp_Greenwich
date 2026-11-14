import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const BARCODE_PATTERN = [2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 2, 1, 3];

export const FlightTicketSkeleton = ({
  screenBgColor = '#F8FAFC',
  delay = 0,
  testID = 'flight-ticket-skeleton',
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const planeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Shimmer pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    // 2. Gliding airplane loop
    const planeLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(planeAnim, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(planeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    planeLoop.start();

    return () => {
      pulseLoop.stop();
      planeLoop.stop();
    };
  }, [delay, planeAnim, pulseAnim]);

  // Color interpolation for skeleton bones
  const lightBoneColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2E8F0', '#F1F5F9'],
  });

  const strongBoneColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBD5E1', '#E2E8F0'],
  });

  const darkBoneColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E293B', '#334155'],
  });

  const amberBoneColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FEF3C7', '#FFFBEB'],
  });

  // Plane animation interpolations
  const planeTranslateX = planeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-22, 22],
  });

  const planeOpacity = planeAnim.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0.2, 1, 1, 0.2],
  });

  const Bone = ({
    width,
    height,
    radius = 6,
    variant = 'light',
    style,
  }) => {
    const bgMap = {
      light: lightBoneColor,
      strong: strongBoneColor,
      dark: darkBoneColor,
      amber: amberBoneColor,
    };

    return (
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: radius,
            backgroundColor: bgMap[variant] || lightBoneColor,
          },
          style,
        ]}
      />
    );
  };

  const isDarkModeBg = screenBgColor === '#121316' || screenBgColor === '#0F172A' || screenBgColor === '#0D1B2A';
  const cardBg = isDarkModeBg ? '#1C1D21' : '#FFFFFF';
  const borderCol = isDarkModeBg ? '#2A2D35' : '#E2E8F0';

  return (
    <View testID={testID} style={styles.cardShadow}>
      <View style={[styles.cardContainer, { backgroundColor: cardBg, borderColor: borderCol }]}>
        {/* ================= HEADER TỐI MÀU (#0F172A) ================= */}
        <View style={styles.headerRow}>
          {/* Cột trái Header: Logo hãng + Tên máy bay + Badge điểm dừng */}
          <View style={styles.leftColumnHeader}>
            <View style={styles.airlineGroup}>
              <Bone width={30} height={30} radius={15} variant="dark" />
              <View style={styles.airlineTextGroup}>
                <Bone width={104} height={12} radius={4} variant="dark" />
                <Bone
                  width={74}
                  height={9}
                  radius={4}
                  variant="dark"
                  style={styles.mt5}
                />
              </View>
            </View>
            {/* Badge "1 stop" */}
            <Bone
              width={44}
              height={18}
              radius={9}
              variant="dark"
              style={{ borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.25)' }}
            />
          </View>

          {/* Cột phải Header: Ngày bay */}
          <View style={styles.rightColumnHeader}>
            <Bone width={68} height={11} radius={4} variant="dark" />
          </View>
        </View>

        {/* ================= THÂN VÉ TRẮNG ================= */}
        <View style={[styles.bodyRow, { backgroundColor: cardBg }]}>
          {/* Cột trái thân vé (68%) */}
          <View style={[styles.leftColumnBody, isDarkModeBg && { borderRightColor: '#334155' }]}>
            {/* Hàng 1: FROM -> Đường bay -> TO */}
            <View style={styles.routeRow}>
              {/* Điểm đi (FROM) */}
              <View style={styles.endpointCol}>
                <Bone width={28} height={7} radius={3} />
                <Bone width={52} height={20} radius={5} variant="strong" style={styles.mt6} />
                <Bone width={42} height={9} radius={4} style={styles.mt6} />
                <Bone width={38} height={12} radius={4} variant="strong" style={styles.mt6} />
              </View>

              {/* Giữa: Thời gian bay + Đường đứt nét + Máy bay */}
              <View style={styles.durationCol}>
                <Bone width={38} height={9} radius={4} />
                <View style={styles.flightPathWrapper}>
                  <View style={[styles.dashedHorizontalLine, isDarkModeBg && { borderColor: '#334155' }]} />
                  <Animated.View
                    style={[
                      styles.planeBadge,
                      {
                        backgroundColor: cardBg,
                        opacity: planeOpacity,
                        transform: [{ translateX: planeTranslateX }],
                      },
                    ]}
                  >
                    <Text style={[styles.planeIcon, isDarkModeBg && { color: '#94A3B8' }]}>✈</Text>
                  </Animated.View>
                </View>
              </View>

              {/* Điểm đến (TO) */}
              <View style={[styles.endpointCol, styles.alignEnd]}>
                <Bone width={20} height={7} radius={3} />
                <Bone width={52} height={20} radius={5} variant="strong" style={styles.mt6} />
                <Bone width={48} height={9} radius={4} style={styles.mt6} />
                <Bone width={38} height={12} radius={4} variant="strong" style={styles.mt6} />
              </View>
            </View>

            {/* Đường kẻ ngang phân tách */}
            <View style={[styles.horizontalDivider, isDarkModeBg && { backgroundColor: '#2A2D35' }]} />

            {/* Hàng 2: FLIGHT | CLASS | SEATS */}
            <View style={styles.metaRow}>
              <View>
                <Bone width={34} height={7} radius={3} />
                <Bone width={48} height={11} radius={4} variant="strong" style={styles.mt5} />
              </View>
              <View>
                <Bone width={32} height={7} radius={3} />
                <Bone width={58} height={11} radius={4} variant="strong" style={styles.mt5} />
              </View>
              <View>
                <Bone width={32} height={7} radius={3} />
                <Bone width={42} height={11} radius={4} variant="strong" style={styles.mt5} />
              </View>
            </View>

            {/* Hàng 3: Thông tin hành lý & Chuyển hành lý tự động */}
            <View style={styles.baggageSection}>
              <View style={styles.baggageLine}>
                <Bone width={12} height={12} radius={3} />
                <Bone width="84%" height={9} radius={4} style={{ marginLeft: 6 }} />
              </View>
              <Bone
                width="52%"
                height={9}
                radius={4}
                variant="amber"
                style={styles.mt6}
              />
            </View>
          </View>

          {/* Cột phải thân vé / Cuống vé (32%): FARE + Barcode */}
          <View style={styles.rightColumnBody}>
            <View style={styles.fareBlock}>
              <Bone width={28} height={7} radius={3} />
              <Bone
                width={78}
                height={15}
                radius={5}
                variant="strong"
                style={styles.mt6}
              />
              <Bone width={46} height={8} radius={4} style={styles.mt5} />
            </View>

            {/* Barcode mô phỏng */}
            <View style={styles.barcodeContainer}>
              {BARCODE_PATTERN.map((barWidth, idx) => (
                <Animated.View
                  key={idx}
                  style={{
                    width: barWidth,
                    height: 24,
                    backgroundColor: strongBoneColor,
                    marginHorizontal: 1.2,
                    borderRadius: 0.5,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* ================= 4 VẾT CẮT BÁN NGUYỆT (TICKET NOTCHES) ================= */}
        {/* Vết cắt mép trái & phải ngay ranh giới Header - Body */}
        <View
          testID="skel-notch-left"
          style={[
            styles.sideNotch,
            styles.leftNotch,
            { backgroundColor: screenBgColor, borderColor: borderCol },
          ]}
        />
        <View
          testID="skel-notch-right"
          style={[
            styles.sideNotch,
            styles.rightNotch,
            { backgroundColor: screenBgColor, borderColor: borderCol },
          ]}
        />

        {/* Vết cắt trên & dưới ngay đường xé vé dọc (68%) */}
        <View
          testID="skel-notch-top"
          style={[
            styles.verticalNotch,
            styles.topDividerNotch,
            { backgroundColor: screenBgColor, borderColor: borderCol },
          ]}
        />
        <View
          testID="skel-notch-bottom"
          style={[
            styles.verticalNotch,
            styles.bottomDividerNotch,
            { backgroundColor: screenBgColor, borderColor: borderCol },
          ]}
        />
      </View>
    </View>
  );
};

/** Component hiển thị danh sách 3 vé loading xếp chồng có độ trễ nhịp nhàng */
export const FlightTicketSkeletonList = ({
  screenBgColor = '#F8FAFC',
  testID = 'flight-ticket-skeleton-list',
}) => {
  return (
    <View testID={testID} style={styles.listContainer}>
      {[0, 1, 2].map((index) => (
        <FlightTicketSkeleton
          key={index}
          testID={`flight-ticket-skeleton-${index}`}
          screenBgColor={screenBgColor}
          delay={index * 180}
        />
      ))}
    </View>
  );
};

export default FlightTicketSkeletonList;

const HEADER_HEIGHT = 56;
const LEFT_SPLIT = '68%';
const RIGHT_SPLIT = '32%';

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
    gap: 14,
  },
  cardShadow: {
    borderRadius: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: 'transparent',
    marginVertical: 4,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  /* Header */
  headerRow: {
    height: HEADER_HEIGHT,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
  },
  leftColumnHeader: {
    width: LEFT_SPLIT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderStyle: 'dashed',
    borderRightColor: '#334155',
  },
  airlineGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineTextGroup: {
    marginLeft: 10,
  },
  rightColumnHeader: {
    width: RIGHT_SPLIT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  /* Body */
  bodyRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  leftColumnBody: {
    width: LEFT_SPLIT,
    padding: 14,
    borderRightWidth: 1,
    borderStyle: 'dashed',
    borderRightColor: '#CBD5E1',
  },
  rightColumnBody: {
    width: RIGHT_SPLIT,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /* Route */
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endpointCol: {
    flex: 1,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  durationCol: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  flightPathWrapper: {
    width: '100%',
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  dashedHorizontalLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  planeBadge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 3,
  },
  planeIcon: {
    fontSize: 12,
    color: '#64748B',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 11,
  },
  /* Meta row */
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  /* Baggage */
  baggageSection: {
    marginTop: 11,
  },
  baggageLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* Right Stub */
  fareBlock: {
    alignItems: 'center',
    marginTop: 2,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    opacity: 0.75,
  },
  /* Ticket Notches */
  sideNotch: {
    position: 'absolute',
    top: HEADER_HEIGHT - 7,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  leftNotch: {
    left: -8,
  },
  rightNotch: {
    right: -8,
  },
  verticalNotch: {
    position: 'absolute',
    left: LEFT_SPLIT,
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  topDividerNotch: {
    top: -7,
  },
  bottomDividerNotch: {
    bottom: -7,
  },
  /* Spacing helpers */
  mt5: {
    marginTop: 5,
  },
  mt6: {
    marginTop: 6,
  },
});
