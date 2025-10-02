import { Container } from "@/components/layout/Container";
import { ImageGallery } from "@/components/layout/ImageGallery";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons/ArrowIcon";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center text-center">
        {/* El padding vertical excesivo (py-24) ha sido eliminado de aquí */}
        <div className="flex flex-col items-center pt-24"> {/* Mantenemos solo padding superior */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            La carta de tu restaurante, <br />
            accesible para todos.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Alergenu es la solución digital que ayuda a tus clientes a elegir sus platos con seguridad y confianza, <br />
            evitando cualquier alérgeno o intolerancia.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button href="/#">
              Descubre cómo funciona
              <ArrowIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Añadimos un margen superior controlado a la galería para separarla */}
      <div className="mt-20">
        <ImageGallery />
      </div>

    </Container>
  );
}
