
import { render, screen, fireEvent } from '@testing-library/react';
import { AllergenSelector } from '../AllergenSelector';

describe('AllergenSelector component', () => {
  it('Debería renderizar los tres botones de opción', () => {
    const handleChange = jest.fn();
    render(<AllergenSelector value="no" onChange={handleChange} />);

    expect(screen.getByText('NO')).toBeInTheDocument();
    expect(screen.getByText('TRAZAS')).toBeInTheDocument();
    expect(screen.getByText('SI')).toBeInTheDocument();
  });

  it('Debería llamar a onChange con "no" al hacer clic en el botón "NO"', () => {
    const handleChange = jest.fn();
    render(<AllergenSelector value="yes" onChange={handleChange} />);

    const noButton = screen.getByText('NO');
    fireEvent.click(noButton);

    expect(handleChange).toHaveBeenCalledWith('no');
  });

  it('Debería llamar a onChange con "traces" al hacer clic en el botón "TRAZAS"', () => {
    const handleChange = jest.fn();
    render(<AllergenSelector value="no" onChange={handleChange} />);

    const tracesButton = screen.getByText('TRAZAS');
    fireEvent.click(tracesButton);

    expect(handleChange).toHaveBeenCalledWith('traces');
  });

  it('Debería llamar a onChange con "yes" al hacer clic en el botón "SI"', () => {
    const handleChange = jest.fn();
    render(<AllergenSelector value="no" onChange={handleChange} />);

    const yesButton = screen.getByText('SI');
    fireEvent.click(yesButton);

    expect(handleChange).toHaveBeenCalledWith('yes');
  });

  it('Debería aplicar el estilo correcto al botón activo', () => {
    const handleChange = jest.fn();
    render(<AllergenSelector value="traces" onChange={handleChange} />);

    const tracesButton = screen.getByText('TRAZAS');
    
    // El botón "TRAZAS" debería tener el estilo de activo
    expect(tracesButton).toHaveClass('bg-yellow-500');

    // Los otros botones no deberían tenerlo
    expect(screen.getByText('NO')).not.toHaveClass('bg-red-500');
    expect(screen.getByText('SI')).not.toHaveClass('bg-blue-600');
  });
});
