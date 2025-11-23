
import { render, screen, fireEvent } from '@testing-library/react';
import { Faq } from '../Faq';

const mockData = [
  {
    question: '¿Pregunta de prueba 1?',
    answer: 'Respuesta de prueba 1.',
  },
  {
    question: '¿Pregunta de prueba 2?',
    answer: 'Respuesta de prueba 2.',
  },
];

describe('Faq component', () => {
  it('Muestra las preguntas', () => {
    render(<Faq data={mockData} />);

    expect(screen.getByText('¿Pregunta de prueba 1?')).toBeInTheDocument();
    expect(screen.getByText('¿Pregunta de prueba 2?')).toBeInTheDocument();
  });

  it('Muestra la respuesta al hacer clic en una pregunta', () => {
    render(<Faq data={mockData} />);

    const question1 = screen.getByText('¿Pregunta de prueba 1?');
    fireEvent.click(question1);

    expect(screen.getByText('Respuesta de prueba 1.')).toBeInTheDocument();
  });

  it('Oculta la respuesta al volver a hacer clic en la pregunta', () => {
    render(<Faq data={mockData} />);

    const question1 = screen.getByText('¿Pregunta de prueba 1?');
    
    // Abrir
    fireEvent.click(question1);
    expect(screen.getByText('Respuesta de prueba 1.')).toBeInTheDocument();

    // Cerrar
    fireEvent.click(question1);
    expect(screen.queryByText('Respuesta de prueba 1.')).not.toBeInTheDocument();
  });
});
