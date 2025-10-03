import Image from 'next/image';
import styles from './ImageGallery.module.css';

const images = [
  { src: '/assets/carrusel_(1).jpg', alt: 'Hombre en un restaurante revisando el menú digital de Alergenu en su smartphone.' },
  { src: '/assets/carrusel_(2).jpg', alt: 'Mujer en una terraza consultando los alérgenos de su comida en la aplicación Alergenu.' },
  { src: '/assets/carrusel_(3).jpg', alt: 'Una persona sosteniendo un móvil que muestra el menú sin gluten de un restaurante gracias a Alergenu.' },
  { src: '/assets/carrusel_(4).jpg', alt: 'Hombre explorando el menú de un bar en su teléfono para evitar la lactosa con Alergenu.' },
  { src: '/assets/carrusel_(5).jpg', alt: 'Mujer en una cafetería eligiendo su pedido de forma segura con la aplicación de menús para alérgicos Alergenu.' },
];

// Duplicamos el array para que la animación sea un bucle infinito y sin saltos
const duplicatedImages = [...images, ...images];

export function ImageGallery() {
  return (
    <div className={styles.scroller}>
      <div className={styles.scroller__inner}>
        {duplicatedImages.map((image, index) => (
          <div key={index} className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              width={240} // Corregido: Ancho correcto
              height={180} // Corregido: Alto correcto
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
