import React from 'react';
import { render, screen } from '@testing-library/react';
import Workspace from '@/app/workspace/page';
import { describe, it, expect, vi } from 'vitest';

// Mock expensive/problematic child components
vi.mock('@/components/layout/Sidebar', () => ({
  default: () => <div data-testid="sidebar-mock" />
}));

vi.mock('@/components/layout/TrustDisclosure', () => ({
  default: () => <div data-testid="trust-mock" />
}));

vi.mock('@/components/chat/EmptyChat', () => ({
  default: () => <div data-testid="empty-chat-mock" />
}));

describe('Workspace Component Rendering', () => {
  it('renders initial empty chat state', () => {
    render(<Workspace />);
    // The Workspace title should always be there
    expect(screen.getByText('Workspace')).toBeDefined();
    // The empty chat mock should be visible because hasStartedChat is false initially
    expect(screen.getByTestId('empty-chat-mock')).toBeDefined();
  });
});
