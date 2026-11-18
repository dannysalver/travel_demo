import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ErrorBoundary from 'ui-component/ErrorBoundary';

function Boom() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('shows the fallback instead of crashing the app', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText('We hit an unexpected error')).toBeInTheDocument();
    spy.mockRestore();
  });
});
