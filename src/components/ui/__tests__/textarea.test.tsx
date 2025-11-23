
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '../textarea';

describe('Textarea component', () => {
  it('Debería renderizar el textarea correctamente', () => {
    render(<Textarea data-testid="test-textarea" />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toBeInTheDocument();
  });

  it('Debería estar deshabilitado cuando se le pasa la prop "disabled"', () => {
    render(<Textarea disabled data-testid="test-textarea" />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toBeDisabled();
  });

  it('Debería permitir al usuario escribir texto', () => {
    render(<Textarea data-testid="test-textarea" />);
    const textareaElement = screen.getByTestId('test-textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textareaElement, { target: { value: 'Este es un texto largo' } });
    
    expect(textareaElement.value).toBe('Este es un texto largo');
  });

  it('Debería mostrar el texto del placeholder', () => {
    render(<Textarea placeholder="Escribe un comentario..." />);
    const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
    expect(textareaElement).toBeInTheDocument();
  });

  it('Debería aceptar clases CSS adicionales', () => {
    render(<Textarea className="custom-textarea-class" data-testid="test-textarea" />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toHaveClass('custom-textarea-class');
  });
});
