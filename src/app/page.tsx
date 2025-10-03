import { Container } from "@/components/layout/Container";
import { ImageGallery } from "@/components/layout/ImageGallery";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/icons/ArrowIcon";

export default function Home() {
  return (
    <Container as="main" className="py-20">
      <div className="grid grid-cols-2 items-center gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold leading-tight">Descubre un mundo de sabores sin preocupaciones</h1>
          <p className="text-lg text-muted-foreground">
            Nuestra app te ayuda a encontrar restaurantes y productos seguros para tus alergias e intolerancias alimentarias. 
            Explora, descubre y disfruta de la comida con total tranquilidad.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" asChild>
              <a href="/register">
                Únete gratis
                <ArrowIcon />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/mapa">
                Explora el mapa
              </a>
            </Button>
          </div>
        </div>
        <ImageGallery />
      </div>
    </Container>
  );
}
