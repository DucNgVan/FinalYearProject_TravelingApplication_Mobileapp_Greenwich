import React from 'react';
import { render } from '@testing-library/react-native';
import CategoryBadge from '../../src/components/common/CategoryBadge';
import LucideIcon from '../../src/components/common/LucideIcon';
import HomeScreen from '../../src/screens/home/HomeScreen';

describe('TDD Suite: React Native Design System Components & Lucide Icons', () => {
  test('RED-REACT-DS-01: CategoryBadge variant "flights" applies #F0F9FF background and #0EA5E9 text/icon', () => {
    const { getByTestId, getByText } = render(
      <CategoryBadge category="flights" label="Flights" />
    );

    const circle = getByTestId('category-badge-circle-flights');
    const circleStyle = Array.isArray(circle.props.style)
      ? Object.assign({}, ...circle.props.style)
      : circle.props.style;
    expect(circleStyle.backgroundColor).toBe('#F0F9FF');

    const glyph = getByText('✈️');
    const glyphStyle = Array.isArray(glyph.props.style)
      ? Object.assign({}, ...glyph.props.style)
      : glyph.props.style;
    expect(glyphStyle.color).toBe('#0EA5E9');
  });

  test('RED-REACT-DS-02: CategoryBadge variant "hotels" applies #FFF7ED background and #F97316 text/icon', () => {
    const { getByTestId, getByText } = render(
      <CategoryBadge category="hotels" label="Hotels" />
    );

    const circle = getByTestId('category-badge-circle-hotels');
    const circleStyle = Array.isArray(circle.props.style)
      ? Object.assign({}, ...circle.props.style)
      : circle.props.style;
    expect(circleStyle.backgroundColor).toBe('#FFF7ED');

    const glyph = getByText('🏨');
    const glyphStyle = Array.isArray(glyph.props.style)
      ? Object.assign({}, ...glyph.props.style)
      : glyph.props.style;
    expect(glyphStyle.color).toBe('#F97316');
  });

  test('RED-REACT-DS-03: CategoryBadge variants "home", "plan", "group" apply semantic backgrounds and colors', () => {
    const { getByTestId: getHomeCircle, getByText: getHomeGlyph } = render(
      <CategoryBadge category="home" label="Home" />
    );
    const homeCircle = getHomeCircle('category-badge-circle-home');
    const homeCircleStyle = Array.isArray(homeCircle.props.style)
      ? Object.assign({}, ...homeCircle.props.style)
      : homeCircle.props.style;
    expect(homeCircleStyle.backgroundColor).toBe('#FFFBEB');

    const { getByTestId: getPlanCircle, getByText: getPlanGlyph } = render(
      <CategoryBadge category="plan" label="Plan" />
    );
    const planCircle = getPlanCircle('category-badge-circle-plan');
    const planCircleStyle = Array.isArray(planCircle.props.style)
      ? Object.assign({}, ...planCircle.props.style)
      : planCircle.props.style;
    expect(planCircleStyle.backgroundColor).toBe('#F1F5F9');

    const { getByTestId: getGroupCircle, getByText: getGroupGlyph } = render(
      <CategoryBadge category="group" label="Group" />
    );
    const groupCircle = getGroupCircle('category-badge-circle-group');
    const groupCircleStyle = Array.isArray(groupCircle.props.style)
      ? Object.assign({}, ...groupCircle.props.style)
      : groupCircle.props.style;
    expect(groupCircleStyle.backgroundColor).toBe('#ECFDF5');
  });

  test('RED-REACT-DS-04: LucideIcon renders supported icons with custom color and stroke', () => {
    const { getByTestId } = render(
      <LucideIcon name="plane" size={24} color="#0EA5E9" />
    );
    const icon = getByTestId('lucide-icon-plane');
    expect(icon).toBeTruthy();
  });

  test('RED-REACT-DS-05: HomeScreen renders Quick Shortcuts with CategoryBadge components', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('category-badge-circle-flights')).toBeTruthy();
    expect(getByTestId('category-badge-circle-hotels')).toBeTruthy();
    expect(getByTestId('category-badge-circle-plan')).toBeTruthy();
    expect(getByTestId('category-badge-circle-group')).toBeTruthy();
  });
});
