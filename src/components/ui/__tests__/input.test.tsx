
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';

describe('Input component', () => {
  it('Debería renderizar el input correctamente', () => {
    render(<Input data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toBeInTheDocument();
  });

  it('Debería estar deshabilitado cuando se le pasa la prop "disabled"', () => {
    render(<Input disabled data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toBeDisabled();
  });

  it('Debería permitir al usuario escribir texto', () => {
    render(<Input data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input') as HTMLInputElement;
    
    fireEvent.change(inputElement, { target: { value: 'Hello world' } });
    
    expect(inputElement.value).toBe('Hello world');
  });

  it('Debería mostrar el texto del placeholder', () => {
    render(<Input placeholder="Escribe aquí..." />);
    const inputElement = screen.getByPlaceholderText('Escribe aquí...');
    expect(inputElement).toBeInTheDocument();
  });

  it('Debería aceptar clases CSS adicionales', () => {
    render(<Input className="custom-class" data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toHaveClass('custom-class');
  });
});
