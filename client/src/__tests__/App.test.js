import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders SkillBridge app', () => {
  render(<App />);
  const linkElement = screen.getByText(/SkillBridge/i);
  expect(linkElement).toBeInTheDocument();
});