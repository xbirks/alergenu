
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button component', () => {
  it('Debería renderizar con las clases por defecto', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-primary text-primary-foreground');
    expect(button).toHaveClass('h-10 px-4 py-2');
  });

  it('Debería renderizar la variante "destructive"', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive text-destructive-foreground');
  });

  it('Debería renderizar la variante "outline"', () => {
    render(<Button variant="outline">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveClass('border border-input bg-background');
  });

  it('Debería renderizar la variante "secondary"', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const button = screen.getByRole('button', { name: /cancel/i });
    expect(button).toHaveClass('bg-secondary text-secondary-foreground');
  });

  it('Debería renderizar la variante "ghost"', () => {
    render(<Button variant="ghost">Undo</Button>);
    const button = screen.getByRole('button', { name: /undo/i });
    expect(button).toHaveClass('hover:bg-accent hover:text-accent-foreground');
  });

  it('Debería renderizar la variante "link"', () => {
    render(<Button variant="link">Go to home</Button>);
    const button = screen.getByRole('button', { name: /go to home/i });
    expect(button).toHaveClass('text-primary underline-offset-4 hover:underline');
  });

  it('Debería renderizar el tamaño "sm"', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-9 rounded-md px-3');
  });

  it('Debería renderizar el tamaño "lg"', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-11 rounded-md px-8');
  });

  it('Debería renderizar el tamaño "icon"', () => {
    render(<Button size="icon">Icon</Button>);
    const button = screen.getByRole('button', { name: /icon/i });
    expect(button).toHaveClass('h-10 w-10');
  });

  it('Debería estar deshabilitado', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('Debería renderizarse como un componente hijo con asChild', () => {
    render(
      <Button asChild>
        <a href="/">Home</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('bg-primary'); // Asegurarnos que hereda los estilos
  });
});
