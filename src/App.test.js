import { render, screen } from '@testing-library/react';
import App from './App';

test('renders casino balance label', () => {
  render(<App />);
  const balanceLabel = screen.getByText(/saldo:/i);
  expect(balanceLabel).toBeInTheDocument();
});
