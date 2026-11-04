import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GroupScreen from '../../src/screens/group/GroupScreen';

describe('Component Test: GroupScreen (Squad Collaboration, Expenses & Packing List)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-FE-GRP-01: should render squad members list with roles (Owner, Editor, Viewer)', () => {
    const { getByTestId, getByText } = render(<GroupScreen />);

    expect(getByTestId('group-members-list')).toBeTruthy();
    expect(getByText(/Thành viên nhóm|Squad Members/i)).toBeTruthy();
    expect(getByText(/Chủ chuyến đi|Owner/i)).toBeTruthy();
  });

  test('RED-FE-GRP-02: should render Total Trip Spend, Net Balance cards, and Settle Up section', () => {
    const { getByTestId, getByText } = render(<GroupScreen />);

    expect(getByTestId('group-expense-summary')).toBeTruthy();
    expect(getByText(/Tổng chi tiêu|Total Trip Spend/i)).toBeTruthy();
    expect(getByText(/Bạn đang nợ|You owe/i)).toBeTruthy();
    expect(getByText(/Bạn được nhận|You're owed/i)).toBeTruthy();
    expect(getByTestId('settle-up-card')).toBeTruthy();
  });

  test('RED-FE-GRP-03: should render Collaborative Packing List with categories and toggleable items', () => {
    const { getByTestId, getByText } = render(<GroupScreen />);

    const packingSection = getByTestId('group-packing-list');
    expect(packingSection).toBeTruthy();
    expect(getByText(/Đồ cần chuẩn bị|Packing List/i)).toBeTruthy();

    // Check item toggling
    const firstCheckItem = getByTestId('packing-item-0');
    expect(firstCheckItem).toBeTruthy();
    fireEvent.press(firstCheckItem);
    expect(getByTestId('group-packing-list')).toBeTruthy();
  });

  test('RED-FE-GRP-04: should allow adding a new packing item to the checklist', () => {
    const { getByTestId, getByPlaceholderText } = render(<GroupScreen />);

    const input = getByPlaceholderText(/Thêm đồ cần mang|Add item/i);
    expect(input).toBeTruthy();
    fireEvent.changeText(input, 'Sạc dự phòng Anker');

    const addBtn = getByTestId('btn-add-packing-item');
    fireEvent.press(addBtn);

    expect(getByTestId('group-packing-list')).toBeTruthy();
  });
});
