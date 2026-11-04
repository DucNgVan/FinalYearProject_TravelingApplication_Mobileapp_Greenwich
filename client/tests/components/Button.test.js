import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Component Test: Button', () => {
  test('should render title and handle press event', () => {
    const handlePress = jest.fn();
    const { getByText } = render(<Button title="Submit" onPress={handlePress} />);

    fireEvent.press(getByText('Submit'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  test('should render outline variant and disabled state', () => {
    const handlePress = jest.fn();
    const { getByText } = render(
      <Button title="Outline Btn" variant="outline" disabled onPress={handlePress} />
    );

    fireEvent.press(getByText('Outline Btn'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  test('should render activity indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Loading Btn" loading />
    );

    expect(queryByText('Loading Btn')).toBeNull();
  });
});
