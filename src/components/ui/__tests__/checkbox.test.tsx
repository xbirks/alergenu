jest.mock('lucide-react');
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../checkbox';

describe('Checkbox component', () => {
  it('Debería renderizar el checkbox correctamente', () => {
    render(<Checkbox aria-label="Test Checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('Debería estar deshabilitado cuando se le pasa la prop "disabled"', () => {
    render(<Checkbox disabled aria-label="Disabled Checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('Debería cambiar de estado al hacer clic', () => {
    render(<Checkbox aria-label="Clickable Checkbox" />);
    const checkbox = screen.getByRole('checkbox');

    // Estado inicial: desmarcado
    expect(checkbox).not.toBeChecked();

    // Hacemos clic para marcarlo
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Hacemos clic de nuevo para desmarcarlo
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('Debería estar marcado inicialmente si se le pasa la prop "checked"', () => {
    render(<Checkbox checked aria-label="Checked Checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it("Debería tener el atributo data-state como 'checked' cuando está marcado", () => {
    render(<Checkbox checked aria-label="Checked Indicator" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it("Debería tener el atributo data-state como 'unchecked' cuando no está marcado", () => {
    render(<Checkbox aria-label="Unchecked Indicator" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });
});
