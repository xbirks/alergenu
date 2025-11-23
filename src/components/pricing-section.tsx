import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <div className="space-y-8">
      {/* Plan Gratuito */}
      <div className="rounded-2xl p-8 bg-gray-50 border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Plan Gratuito
        </h3>

        <span className="mt-3 inline-flex items-center rounded-full bg-gray-900 px-4 py-1 text-sm font-semibold text-white">
          3 meses gratis
        </span>

        <p className="mt-6 text-lg font-semibold text-gray-900">
          Ideal para probar el servicio sin ningún compromiso y darte cuenta que
          lo necesitas.
        </p>

        <p className="mt-8 text-base text-gray-700 underline underline-offset-4 decoration-gray-300">
          Funcionalidades incluidas durante 3 meses:
        </p>

        <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
          <li className="text-base text-gray-700">
            Crea platos y bebidas de forma ilimitada.
          </li>
          <li className="text-base text-gray-700">
            Generador de QR para la carta.
          </li>
          <li className="text-base text-blue-600">
            Filtro de alérgenos con IA incluido.
          </li>
          <li className="text-base text-gray-700">
            Atención al cliente por e-mail.
          </li>
        </ul>

        <Button
          asChild
          size="lg"
          className="mt-10 h-14 w-full rounded-full bg-gray-900 text-lg font-semibold text-white hover:bg-gray-900/90"
        >
          <Link href="/register?plan=gratuito">Suscribirse</Link>
        </Button>
      </div>

      {/* Plan Autonomía */}
      <div className="rounded-2xl p-8 bg-gray-50 border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Plan Autonomía
        </h3>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-blue-600">
            12€
          </span>
          <span className="text-base font-semibold text-blue-600">/ mes</span>
          <span className="ml-2 text-sm text-red-500 line-through">
            Antes 19€ /mes
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">IVA incluido</p>

        <p className="mt-6 text-lg font-semibold text-gray-900">
          Ideal si quieres control total y no te importa dedicarle un rato al
          principio.
        </p>

        <p className="mt-8 text-base text-gray-700 underline underline-offset-4 decoration-gray-300">
          Funcionalidades incluidas:
        </p>

        <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
          <li className="text-base text-gray-700">
            Crea platos y bebidas de forma ilimitada.
          </li>
          <li className="text-base text-gray-700">
            Generador de QR para la carta.
          </li>
          <li className="text-base text-blue-600">
            Filtro de alérgenos con IA incluido.
          </li>
          <li className="text-base text-gray-700">
            Gestión 100% autónoma del menú y los alérgenos.
          </li>
          <li className="text-base text-gray-700">
            Atención al cliente por e-mail.
          </li>
          <li className="text-base text-gray-700">
            Crea la carta en 2 idiomas diferentes.
          </li>
        </ul>

        <Button
          asChild
          size="lg"
          className="mt-10 h-14 w-full rounded-full bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
        >
          <Link href="/register?plan=autonomia">Suscribirse</Link>
        </Button>
      </div>

      {/* Plan Premium */}
      <div className="rounded-2xl p-8 bg-gray-50 border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Plan Premium
        </h3>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-blue-600">
            79€
          </span>
          <span className="text-base font-semibold text-blue-600">/ mes</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">IVA incluido</p>

        <p className="mt-6 text-lg font-semibold text-gray-900">
          Ideal si no tienes tiempo. Nos envías tu carta y nosotros nos encargamos
          de todo.
        </p>

        <p className="mt-8 text-base text-gray-700 underline underline-offset-4 decoration-gray-300">
          Todas las funcionalidades del <strong>plan autonomía</strong>{" "}
          incluidas. Y además:
        </p>

        <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
          <li className="text-base text-blue-600">
            Delega la gestión de la carta y los alérgenos para que la trabaje
            nuestro equipo.
          </li>
          <li className="text-base text-gray-700">
            Personalización avanzada de la carta.
          </li>
          <li className="text-base text-gray-700">
            Atención al cliente prioritaria, por teléfono y Whatsapp.
          </li>
          <li className="text-base text-gray-700">Idiomas ilimitados.</li>
        </ul>

        <Button
          asChild
          size="lg"
          className="mt-10 h-14 w-full rounded-full bg-gray-900 text-lg font-semibold text-white hover:bg-gray-900/90"
        >
          <Link href="/register?plan=premium">Suscribirse</Link>
        </Button>
      </div>
    </div>
  );
}
