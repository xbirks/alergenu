'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AllergenModal, { AllergenRecord } from '@/components/dashboard/allergen-modal';
import { ALLERGENS } from '@/lib/allergens';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { UnsavedChangesModal } from '@/components/dashboard/UnsavedChangesModal';

// --- Modelo de Datos --- //
type AllergenStatus = 'no' | 'traces' | 'yes';

const defaultAllergens = ALLERGENS.reduce((acc, allergen) => {
  acc[allergen.id] = 'no';
  return acc;
}, {} as Record<string, AllergenStatus>);

interface Dish {
  id: number;
  name: string;
  allergens: AllergenRecord;
}

interface Course {
  title: string;
  dishes: Dish[];
}

// --- Valores Iniciales --- //
const initialCourses: Course[] = [
  { title: 'Primeros', dishes: [{ id: Date.now() + 1, name: '', allergens: defaultAllergens }] },
  { title: 'Segundos', dishes: [{ id: Date.now() + 2, name: '', allergens: defaultAllergens }] },
  { title: 'Postres', dishes: [{ id: Date.now() + 3, name: '', allergens: defaultAllergens }] },
];

// --- Componente del Icono de Alérgenos --- //
const AllergenIcon = () => (
  <svg width="26" height="26" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.9503 21.5189L10.6417 6.81887M10.6417 6.81887L11.9927 6.28228C12.7093 5.99765 13.3133 5.39525 13.6718 4.6076C14.0303 3.81995 14.114 2.91156 13.9045 2.08228L13.5095 0.51887L12.1585 1.05546C11.4419 1.34008 10.8379 1.94248 10.4794 2.73014C10.1209 3.51779 10.0372 4.42617 10.2467 5.25546L10.6417 6.81887ZM6.11545 16.7624C6.42724 16.0743 6.49962 15.2816 6.31675 14.5578C6.13388 13.8341 5.71065 13.2382 5.13973 12.9007L3.80406 12.1152L3.07278 13.7217C2.76099 14.4098 2.68861 15.2025 2.87148 15.9263C3.05435 16.65 3.47758 17.2459 4.0485 17.5833L5.38417 18.3689M6.11545 16.7624L5.38417 18.3689M6.11545 16.7624C6.42949 16.0756 6.95695 15.5505 7.58236 15.3021C8.20776 15.0537 8.88014 15.1022 9.45229 15.437L10.788 16.2225L10.0567 17.829C9.74265 18.5158 9.21519 19.0408 8.58979 19.2892C7.96438 19.5376 7.292 19.4892 6.71985 19.1544L5.38417 18.3689M8.02729 12.5624C8.33908 11.8743 8.41146 11.0816 8.22859 10.3578C8.04571 9.63406 7.62249 9.03822 7.05157 8.70074L5.71589 7.91523L4.98461 9.52172C4.67282 10.2098 4.60044 11.0025 4.78332 11.7263C4.96619 12.45 5.38942 13.0459 5.96034 13.3833L7.29601 14.1689M8.02729 12.5624L7.29601 14.1689M8.02729 12.5624C8.34133 11.8756 8.86879 11.3505 9.49419 11.1021C10.1196 10.8537 10.792 10.9022 11.3641 11.237L12.6998 12.0225L11.9685 13.629C11.6545 14.3158 11.127 14.8408 10.5016 15.0892C9.87622 15.3376 9.20384 15.2892 8.63168 14.9544L7.29601 14.1689M9.93913 8.36237C10.2509 7.67428 10.3233 6.88158 10.1404 6.15782C9.95755 5.43407 9.53432 4.83822 8.9634 4.50075L7.62773 3.71523L6.89645 5.32173C6.58466 6.00981 6.51228 6.80251 6.69515 7.52627C6.87803 8.25003 7.30125 8.84587 7.87218 9.18335L9.20785 9.96887M9.93913 8.36237L9.20785 9.96887M9.93913 8.36237C10.2532 7.6756 10.7806 7.15054 11.406 6.90213C12.0314 6.65373 12.7038 6.70222 13.276 7.03699L14.6116 7.82251L13.8804 9.42901C13.5663 10.1158 13.0389 10.6408 12.4135 10.8892C11.7881 11.1376 11.1157 11.0892 10.5435 10.7544L9.20785 9.96887" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.9502 19.3256L25.9502 11.8029L19.9502 4.28021" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Componente para una Sección de Platos --- //
function CourseSection({
  title,
  dishes,
  onDishAdd,
  onDishChange,
  onAllergenClick,
  onDetectAllergens,
  analyzingDishId,
  analyzedDishIds,
}: {
  title: string;
  dishes: Dish[];
  onDishAdd: () => void;
  onDishChange: (id: number, name: string) => void;
  onAllergenClick: (dish: Dish) => void;
  onDetectAllergens: (dishId: number, dishName: string) => void;
  analyzingDishId: number | null;
  analyzedDishIds: Set<number>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="space-y-3">
        {dishes.map((dish) => {
          const isAnalyzed = analyzedDishIds.has(dish.id);
          const isAnalyzing = analyzingDishId === dish.id;
          return (
            <div key={dish.id} className="flex items-start gap-2">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder={`Ej: Paella Valenciana`}
                  value={dish.name}
                  onChange={(e) => onDishChange(dish.id, e.target.value)}
                  className={`h-14 rounded-full text-lg ${dish.name ? 'font-bold text-blue-600' : ''}`}
                />
                {isAnalyzing && (
                  <p className="text-xs text-blue-600 mt-1 animate-pulse text-center">
                    Analizando alérgenos con IA...
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => isAnalyzed ? onAllergenClick(dish) : onDetectAllergens(dish.id, dish.name)}
                disabled={!dish.name || isAnalyzing}
                className={`rounded-full w-14 h-14 flex-shrink-0 transition-all duration-300 ease-in-out 
                  ${isAnalyzing ? 'bg-orange-500 cursor-not-allowed' :
                    !dish.name ? 'bg-gray-200 cursor-not-allowed' :
                      isAnalyzed ? (Object.values(dish.allergens).some(v => v !== 'no') ? 'bg-blue-800 hover:bg-blue-900' : 'bg-gray-400 hover:bg-gray-500') :
                        'bg-cyan-500 hover:bg-cyan-600'
                  }`}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : isAnalyzed ? (
                  <AllergenIcon />
                ) : (
                  <Sparkles className="h-6 w-6 text-white" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
      <Button variant="secondary" onClick={onDishAdd} className="w-full h-12 rounded-full text-md font-semibold">
        Añadir plato
      </Button>
    </div>
  );
}

// --- Componente Principal de la Página --- //
export default function DailyMenuPage() {
  const router = useRouter();
  const { user } = useAuth(false);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [startTime, setStartTime] = useState('12:30');
  const [endTime, setEndTime] = useState('15:45');

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // --- Estados para el Análisis de Alérgenos con IA --- //
  const [analyzingDishId, setAnalyzingDishId] = useState<number | null>(null);
  const [analyzedDishIds, setAnalyzedDishIds] = useState<Set<number>>(new Set());

  // --- Estados para el modal de cambios no guardados --- //
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const dailyMenuRef = doc(db, 'restaurants', user.uid, 'dailyMenus', 'current');
        const docSnap = await getDoc(dailyMenuRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPrice((data.price / 100).toFixed(2).replace('.', ','));
          setNote(data.note || '');
          setIsPublished(data.isPublished);
          setStartTime(data.startTime || '12:30');
          setEndTime(data.endTime || '15:45');

          const tempAnalyzedIds = new Set<number>();
          const loadedCourses = initialCourses.map(initialCourse => {
            const savedCourse = data.courses.find((c: Course) => c.title === initialCourse.title);
            if (savedCourse && savedCourse.dishes.length > 0) {
              return {
                ...initialCourse,
                dishes: savedCourse.dishes.map((dish: any, index: number) => {
                  const newId = Date.now() + Math.random() * 1000 + index;
                  // Si el plato guardado tiene alérgenos, lo consideramos "analizado" y permitimos editar directamente
                  if (dish.allergens && Object.keys(dish.allergens).length > 0) {
                    tempAnalyzedIds.add(newId);
                  }
                  return {
                    id: newId,
                    name: dish.name,
                    allergens: { ...defaultAllergens, ...dish.allergens }
                  };
                })
              };
            }
            return initialCourse;
          });
          setCourses(loadedCourses);
          setAnalyzedDishIds(tempAnalyzedIds);
        }
      } catch (error) {
        console.error("Error fetching daily menu data:", error);
        toast({ title: 'Error al cargar datos', description: 'No se pudo recuperar el menú guardado.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [user, toast]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const handleFormChange = () => {
      setHasUnsavedChanges(true);
    };

    document.addEventListener('input', handleFormChange);
    document.addEventListener('change', handleFormChange);

    return () => {
      document.removeEventListener('input', handleFormChange);
      document.removeEventListener('change', handleFormChange);
    };
  }, []);

  // Advertencia del navegador al cerrar/recargar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Interceptar botón "atrás" del navegador/móvil
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Agregar una entrada al historial para interceptar el botón "atrás"
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Prevenir la navegación
        window.history.pushState(null, '', window.location.href);

        // Mostrar el modal
        setPendingNavigation('/dashboard');
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleAllergenDetect = async (dishId: number, dishName: string) => {
    setAnalyzingDishId(dishId);
    try {
      const response = await fetch('/api/detect-allergens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { allergens: detectedAllergenIds } = await response.json();

      setCourses(currentCourses => currentCourses.map(course => ({
        ...course,
        dishes: course.dishes.map(dish => {
          if (dish.id === dishId) {
            // Resetear todos los alérgenos a 'no' antes de aplicar los nuevos
            const newAllergens = { ...defaultAllergens };
            detectedAllergenIds.forEach((allergenId: string) => {
              if (allergenId in newAllergens) {
                newAllergens[allergenId] = 'yes'; // Marcar como 'yes'
              }
            });
            return { ...dish, allergens: newAllergens };
          }
          return dish;
        }),
      })));

      setAnalyzedDishIds(prev => new Set(prev).add(dishId));
      toast({ title: '¡Análisis completado!', description: `Se encontraron ${detectedAllergenIds.length} alérgenos. Puedes revisar y ajustar el resultado.` });

    } catch (error) {
      console.error("Error detecting allergens:", error);
      toast({ title: 'Error en el análisis', description: 'No se pudo detectar los alérgenos. Por favor, añádelos manually.', variant: 'destructive' });
      // Marcamos como analizado igualmente para no bloquear al usuario y permitir edición manual
      setAnalyzedDishIds(prev => new Set(prev).add(dishId));
    } finally {
      setAnalyzingDishId(null);
    }
  };

  const handleDishAdd = (courseTitle: string) => {
    setCourses(courses.map(course => {
      if (course.title === courseTitle) {
        return { ...course, dishes: [...course.dishes, { id: Date.now(), name: '', allergens: defaultAllergens }] };
      }
      return course;
    }));
  };

  const handleDishChange = (courseTitle: string, id: number, name: string) => {
    setCourses(courses.map(course => {
      if (course.title === courseTitle) {
        const updatedDishes = course.dishes.map(dish => dish.id === id ? { ...dish, name } : dish);
        return { ...course, dishes: updatedDishes };
      }
      return course;
    }));
    // Si el nombre cambia, reseteamos el estado de "analizado" para permitir un nuevo análisis
    if (analyzedDishIds.has(id)) {
      setAnalyzedDishIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAllergenClick = (dish: Dish, courseTitle: string) => {
    setSelectedDish(dish);
    setSelectedCourse(courseTitle);
    setModalOpen(true);
  };

  const handleAllergenSave = (allergens: AllergenRecord) => {
    if (selectedDish && selectedCourse) {
      setCourses(courses.map(course => {
        if (course.title === selectedCourse) {
          const updatedDishes = course.dishes.map(dish =>
            dish.id === selectedDish.id ? { ...dish, allergens } : dish
          );
          return { ...course, dishes: updatedDishes };
        }
        return course;
      }));
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast({ title: 'Error de autenticación', description: 'Por favor, inicia sesión de nuevo.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
      if (isNaN(priceInCents) || priceInCents <= 0) {
        toast({ title: 'Precio no válido', description: 'Por favor, introduce un precio correcto para el menú.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      const formattedCourses = courses.map(course => ({
        ...course,
        dishes: course.dishes
          .filter(dish => dish.name.trim() !== '')
          .map(dish => ({
            name: dish.name.trim(),
            allergens: Object.entries(dish.allergens)
              .filter(([, status]) => status !== 'no')
              .reduce((acc, [key, status]) => ({ ...acc, [key]: status }), {}),
          })),
      }));

      const dataToSave = {
        courses: formattedCourses,
        price: priceInCents,
        note,
        isPublished,
        startTime,
        endTime,
        updatedAt: serverTimestamp(),
      };

      const dailyMenuRef = doc(db, 'restaurants', user.uid, 'dailyMenus', 'current');
      await setDoc(dailyMenuRef, dataToSave);

      setHasUnsavedChanges(false); // Resetear flag de cambios
      toast({ title: '¡Menú del día guardado!', description: 'Los cambios se han guardado correctamente.' });
      router.push('/dashboard');

    } catch (error) {
      console.error("Error saving daily menu: ", error);
      toast({ title: 'Error al guardar', description: 'Ha ocurrido un problema. Por favor, inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Navegación con advertencia de cambios no guardados --- //
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation(e.currentTarget.href);
      setShowExitModal(true);
    }
  };

  const handleStay = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  const handleLeave = () => {
    setHasUnsavedChanges(false); // Permitir la navegación
    setShowExitModal(false);

    // Pequeño delay para asegurar que el flag se actualiza antes de navegar
    setTimeout(() => {
      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
    }, 10);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard"
        onClick={handleBackClick}
        className="inline-flex items-center gap-x-2 text-gray-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Configurar menú del día</h1>
          <p className="text-lg text-muted-foreground font-regular">
            Modifica los platos de hoy, el precio y cuándo quieres que sea visible.
          </p>
        </div>

        {courses.map(course => (
          <CourseSection
            key={course.title}
            title={course.title}
            dishes={course.dishes}
            onDishAdd={() => handleDishAdd(course.title)}
            onDishChange={(id, name) => handleDishChange(course.title, id, name)}
            onAllergenClick={(dish) => handleAllergenClick(dish, course.title)}
            onDetectAllergens={handleAllergenDetect}
            analyzingDishId={analyzingDishId}
            analyzedDishIds={analyzedDishIds}
          />
        ))}

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Precio y detalles</h3>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio del menú (€)</label>
            <Input id="price" type="text" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} placeholder="12,50" className="h-14 rounded-full text-lg" />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Nota (opcional)</label>
            <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Incluye pan, bebida, postre o café..." className="rounded-2xl text-lg" />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Tiempo de aparición en la web</h3>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="publish-switch" className="text-lg font-semibold">Publicar menú del día</Label>
              <p className="text-sm text-muted-foreground">
                {isPublished ? 'El menú será visible en la web.' : 'El menú no se mostrará a los clientes.'}
              </p>
            </div>
            <Switch id="publish-switch" checked={isPublished} onCheckedChange={setIsPublished} />
          </div>

          <div className={`space-y-4 transition-opacity ${!isPublished ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <p className="text-muted-foreground">
              Puedes elegir la franja horaria en la que quieres que el menú del día aparezca. Así, evitarás confusiones con los comensales que lleguen antes o después de la hora que tu estableces.
            </p>
            <div className="flex items-center justify-between gap-4 py-2">
              <label htmlFor="start-time" className="text-xl font-semibold">Desde:</label>
              <div className="relative w-[180px]">
                <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="rounded-full h-14 pl-4 pr-10 text-center font-bold text-xl" disabled={!isPublished} />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <label htmlFor="end-time" className="text-xl font-semibold">Hasta:
              </label>
              <div className="relative w-[180px]">
                <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="rounded-full h-14 pl-4 pr-10 text-center font-bold text-xl" disabled={!isPublished} />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <Button size="lg" onClick={handleSave} disabled={isSubmitting || isLoading} className="w-full h-14 bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg rounded-full">
          {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
          {isSubmitting ? 'Guardando...' : 'Guardar menú'}
        </Button>
      </div>

      {selectedDish && (
        <AllergenModal
          key={selectedDish.id}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          dishName={selectedDish.name}
          initialAllergens={selectedDish.allergens}
          onSave={handleAllergenSave}
        />
      )}

      <UnsavedChangesModal
        isOpen={showExitModal}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </div>
  );
}