import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Home,
  Plane,
  Hotel,
  Map,
  Users,
  User,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react-native';

const ICON_COMPONENTS = {
  home: Home,
  plane: Plane,
  hotel: Hotel,
  map: Map,
  users: Users,
  user: User,
  calendar: Calendar,
  settings: Settings,
  bell: Bell,
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  search: Search,
};

export default function LucideIcon({
  name = 'home',
  size = 20,
  color = '#0F172A',
  strokeWidth = 2.5,
  style,
}) {
  const IconComponent = ICON_COMPONENTS[name] || Home;

  return (
    <View testID={`lucide-icon-${name}`} style={[styles.container, style]}>
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
