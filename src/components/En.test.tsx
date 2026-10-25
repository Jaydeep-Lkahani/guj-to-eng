import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { En } from './En';

describe('En', () => {
  it('marks its text as English', () => {
    render(<En>Apple</En>);
    expect(screen.getByText('Apple')).toHaveAttribute('lang', 'en');
  });

  it('uses the English font and the 22px learning size', () => {
    render(<En>Apple</En>);
    const el = screen.getByText('Apple');
    expect(el).toHaveClass('font-en');
    expect(el).toHaveClass('text-learn');
  });

  it('keeps an extra class name', () => {
    render(<En className="font-bold">Apple</En>);
    expect(screen.getByText('Apple')).toHaveClass('font-en', 'font-bold');
  });
});
