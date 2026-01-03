'use client';

import { useState, useEffect } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MenuUploadHero } from '@/components/landing/MenuUploadHero';
import { AnimatedProgressBar } from '@/components/landing/AnimatedProgressBar';
import { MenuPreviewLocked } from '@/components/landing/MenuPreviewLocked';
import { ConversionModal } from '@/components/landing/ConversionModal';
import { DetectedMenuItem } from '@/ai/menuPhotoAnalysis';
import { toast } from 'sonner';
import { AlertCircle, Shield, Languages, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AllergenIconDisplay } from '@/components/menu/allergen-icon-display';
import './foto-a-carta.scss';

type UploadState = 'idle' | 'ready' | 'analyzing' | 'preview' | 'error';

export default function FotoACartaPage() {
    const [state, setState] = useState<UploadState>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analyzedItems, setAnalyzedItems] = useState<DetectedMenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [showConversionModal, setShowConversionModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [remaining, setRemaining] = useState<number>(5);

    const handleFileSelected = (file: File) => {
        setSelectedFile(file);
        setState('ready');
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setState('analyzing');
        // Scroll to top when analysis starts
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrorMessage('');
        setSuggestions([]);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('/api/analyze-menu-photo', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'limit_reached') {
                    setErrorMessage(data.message);
                    setState('error');
                    // Don't auto-show modal - user will click register button if they want
                    return;
                }

                throw new Error(data.message || 'Error al analizar la imagen');
            }

            if (!data.success && data.qualityIssue) {
                setErrorMessage(data.message);
                setSuggestions(data.suggestions || []);
                setState('error');
                setRemaining(data.remaining);
                return;
            }

            // Check if 0 items were detected
            if (data.items.length === 0) {
                setErrorMessage('No hemos podido detectar ningún plato en la imagen.');
                setSuggestions([
                    'Asegúrate de que la foto muestre claramente el texto del menú',
                    'Evita fotos con mucho brillo o sombras',
                    'Si el menú es muy largo, súbelo por secciones',
                    'Intenta tomar la foto desde arriba, perpendicular a la carta'
                ]);
                setState('error');
                setRemaining(data.remaining);
                return;
            }

            setAnalyzedItems(data.items);
            setCategories(data.detectedCategories);
            setRemaining(data.remaining);
            setState('preview');

            toast.success(`✅ ${data.items.length} platos detectados correctamente`);

        } catch (error) {
            console.error('Error analyzing menu:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
            setState('error');
            toast.error('Error al analizar la imagen');
        }
    };

    const handleRegisterClick = () => {
        setShowConversionModal(true);
    };

    const handleTryAgain = () => {
        setState('idle');
        setSelectedFile(null);
        setErrorMessage('');
        setSuggestions([]);
        // localStorage.removeItem('alergenu_menu_analysis');
    };

    // Load from LocalStorage on mount
    // Load from LocalStorage on mount
    useEffect(() => {
        /*
        try {
            const saved = localStorage.getItem('alergenu_menu_analysis');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.items && data.items.length > 0) {
                    setAnalyzedItems(data.items);
                    setCategories(data.categories || []);
                    if (data.remaining !== undefined) setRemaining(data.remaining);
                    setState('preview');
                    toast.info('Hemos recuperado tu último análisis');
                }
            }
        } catch (e) {
            console.error('Failed to load saved analysis', e);
        }
        */
    }, []);

    // Save to LocalStorage when items change
    // Save to LocalStorage when items change
    useEffect(() => {
        /*
        if (state === 'preview' && analyzedItems.length > 0) {
            localStorage.setItem('alergenu_menu_analysis', JSON.stringify({
                items: analyzedItems,
                categories: categories,
                remaining: remaining
            }));
        }
        */
    }, [analyzedItems, categories, remaining, state]);

    return (
        <div className="foto-a-carta-page">
            <PublicHeader />

            <main>
                {/* Hero Section */}
                {(state === 'idle' || state === 'ready') && (
                    <section className="hero-section">
                        <h1 className="hero-title">
                            Tu menú a <span className="highlight">Web con QR</span> en 30 segundos
                        </h1>

                        {/* Video Loop */}
                        <div className="hero-video">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/assets/videos/30_seg.mp4" type="video/mp4" />
                                {/* Fallback para navegadores sin soporte de video */}
                                Tu navegador no soporta videos HTML5.
                            </video>
                        </div>

                        <p className="hero-description">
                            Sin teclear nada. La IA lo hace por ti. Traducción automática y filtro de alérgenos incluido.
                        </p>

                        <div className="upload-container">
                            <MenuUploadHero
                                onFileSelected={handleFileSelected}
                                isAnalyzing={false}
                            />
                        </div>

                        {/* Create Button - Right after upload */}
                        {state === 'ready' && selectedFile && (
                            <div className="create-button-container">
                                <Button
                                    onClick={handleAnalyze}
                                    size="lg"
                                    className="create-button"
                                >
                                    Crear mi carta digital
                                </Button>
                                <p className="remaining-text">
                                    Te quedan {remaining} análisis gratuitos
                                </p>
                            </div>
                        )}

                        {/* Menu Preview Section - Simple mockup */}
                        <div className="menu-preview-demo">
                            <div className="preview-header">
                                <h2>Así se verá tu carta digital</h2>
                                <p>Vista previa de cómo tus clientes verán el menú en su móvil</p>
                            </div>

                            {/* Mobile Mockup */}
                            <div className="phone-mockup">
                                <div className="phone-frame">
                                    <div className="phone-notch" />

                                    <div className="phone-screen">
                                        <div className="screen-content">
                                            {/* Restaurant Header */}
                                            <div className="menu-header">
                                                <h3>Restaurante Ejemplo</h3>
                                                <p>Aquí puedes ver toda nuestra carta y filtrar los alérgenos</p>
                                            </div>

                                            {/* Menu Content */}
                                            <div className="menu-content">
                                                {/* Entrantes */}
                                                <div className="menu-category">
                                                    <div className="category-header">
                                                        <h4>Entrantes</h4>
                                                    </div>
                                                    <div className="category-items">
                                                        <div className="menu-item">
                                                            <div className="item-header">
                                                                <span className="item-name">Ensalada César</span>
                                                                <span className="item-price">8,50€</span>
                                                            </div>
                                                            <p className="item-description">Lechuga, pollo, parmesano, croutones</p>
                                                            <div className="item-allergens">
                                                                <AllergenIconDisplay allergenId="gluten" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="leche" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="huevos" type="contains" className="!w-5 !h-5" />
                                                            </div>
                                                        </div>
                                                        <div className="menu-item">
                                                            <div className="item-header">
                                                                <span className="item-name">Croquetas de Jamón</span>
                                                                <span className="item-price">7,00€</span>
                                                            </div>
                                                            <p className="item-description">6 unidades con bechamel casera</p>
                                                            <div className="item-allergens">
                                                                <AllergenIconDisplay allergenId="gluten" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="leche" type="contains" className="!w-5 !h-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Principales */}
                                                <div className="menu-category">
                                                    <div className="category-header">
                                                        <h4>Principales</h4>
                                                    </div>
                                                    <div className="category-items">
                                                        <div className="menu-item">
                                                            <div className="item-header">
                                                                <span className="item-name">Salmón a la Plancha</span>
                                                                <span className="item-price">16,50€</span>
                                                            </div>
                                                            <p className="item-description">Con verduras salteadas</p>
                                                            <div className="item-allergens">
                                                                <AllergenIconDisplay allergenId="pescado" type="contains" className="!w-5 !h-5" />
                                                            </div>
                                                        </div>
                                                        <div className="menu-item">
                                                            <div className="item-header">
                                                                <span className="item-name">Pasta Carbonara</span>
                                                                <span className="item-price">12,00€</span>
                                                            </div>
                                                            <p className="item-description">Espaguetis con bacon y parmesano</p>
                                                            <div className="item-allergens">
                                                                <AllergenIconDisplay allergenId="gluten" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="leche" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="huevos" type="contains" className="!w-5 !h-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Postres */}
                                                <div className="menu-category">
                                                    <div className="category-header">
                                                        <h4>Postres</h4>
                                                    </div>
                                                    <div className="category-items">
                                                        <div className="menu-item">
                                                            <div className="item-header">
                                                                <span className="item-name">Tarta de Chocolate</span>
                                                                <span className="item-price">5,50€</span>
                                                            </div>
                                                            <p className="item-description">Con helado de vainilla</p>
                                                            <div className="item-allergens">
                                                                <AllergenIconDisplay allergenId="gluten" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="leche" type="contains" className="!w-5 !h-5" />
                                                                <AllergenIconDisplay allergenId="huevos" type="contains" className="!w-5 !h-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="preview-cta">
                                <Button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    size="lg"
                                    className="cta-button"
                                >
                                    Probar ahora gratis
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {state === 'analyzing' && (
                    <section className="analyzing-section">
                        <AnimatedProgressBar isActive={true} />
                    </section>
                )}

                {state === 'preview' && (
                    <section className="preview-section">
                        <MenuPreviewLocked
                            items={analyzedItems}
                            categories={categories}
                            onRegisterClick={handleRegisterClick}
                        />
                    </section>
                )}

                {state === 'error' && (
                    <section className="error-section">
                        <Alert variant="destructive" className="error-alert">
                            <AlertCircle className="alert-icon" />
                            <AlertTitle>Ups, algo no ha ido bien</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>

                        {suggestions.length > 0 && (
                            <div className="suggestions-box">
                                <h3 className="suggestions-title">
                                    Consejos para mejorar la foto:
                                </h3>
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index} className="suggestion-item">
                                            <span className="bullet">•</span>
                                            <span>{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="error-actions">
                            <Button
                                onClick={handleTryAgain}
                                size="lg"
                                className="retry-button"
                            >
                                Intentar de nuevo
                            </Button>

                            {errorMessage.includes('límite') && (
                                <div className="register-prompt">
                                    <p className="register-text">
                                        ¿Quieres más análisis?
                                    </p>
                                    <Button
                                        onClick={() => setShowConversionModal(true)}
                                        size="lg"
                                        variant="outline"
                                        className="register-button"
                                    >
                                        Registrarse gratis
                                    </Button>
                                </div>
                            )}

                            <p className="remaining-analyses">
                                Te quedan {remaining} análisis restantes
                            </p>
                        </div>
                    </section>
                )}

                {/* SEO CONTENT SECTIONS - Only visible in idle/ready/error states */}
                {(state === 'idle' || state === 'ready' || state === 'error') && (
                    <>
                        {/* 1. HOW IT WORKS SECTION */}
                        <section className="how-it-works">
                            <div className="section-header">
                                <h2>
                                    Pasos para convertir tu foto en un menú web
                                </h2>
                                <p>
                                    Olvídate de transcribir cientos de platos a mano o de contratar diseñadores. Nuestra IA hace el trabajo sucio por ti en cuatro pasos y 30 segundos:
                                </p>
                            </div>

                            {/* Unified Steps Container - Responsive via CSS */}
                            <div className="steps-container">
                                {/* Step 1 */}
                                <div className="step-card">
                                    <div className="step-image">
                                        <img src="/assets/recursos/slidr1.jpeg" alt="Sube la foto del menú" />
                                    </div>
                                    <h3>1. Sube la foto</h3>
                                    <p>
                                        Aceptamos menús en papel, pizarras o capturas de pantalla. Con tan solo 1 foto ya puedes tener tu menú digital listo.
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div className="step-card">
                                    <div className="step-image">
                                        <img src="/assets/recursos/slidr2.jpg" alt="Digitalización con IA" />
                                    </div>
                                    <h3>2. Digitalización IA</h3>
                                    <p>
                                        Nuestra IA analiza el texto, detecta los platos y estructura los precios automáticamente en solo 30 segundos.
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div className="step-card">
                                    <div className="step-image">
                                        <img src="/assets/recursos/slidr3.jpg" alt="Detección de alérgenos" />
                                    </div>
                                    <h3>3. Mejora</h3>
                                    <p>
                                        La tecnología de Alergenu detecta los alérgenos basándose en los ingredientes y habilita la traducción automática a inglés.
                                    </p>
                                </div>

                                {/* Step 4 */}
                                <div className="step-card">
                                    <div className="step-image">
                                        <img src="/assets/recursos/slidr4.jpg" alt="Genera tu QR" />
                                    </div>
                                    <h3>4. Revisión y QR</h3>
                                    <p>
                                        Verificas que todo esté correcto, generas tu QR y listo para imprimir.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. COMPETITIVE ADVANTAGES SECTION */}
                        <section className="advantages">
                            <div className="section-header">
                                <h2>
                                    Mucho más que un simple PDF
                                </h2>
                                <p>
                                    La mayoría de generadores de QR solo muestran una foto estática de tu menú (PDF). Alergenu transforma esa foto en una página web interactiva y viva.
                                </p>
                            </div>

                            <div className="advantages-grid">
                                {/* Feature 1: Allergen Filter */}
                                <div className="advantage-card card-legal">
                                    <div className="card-gradient-header"></div>
                                    <div className="icon-wrapper">
                                        <Shield size={32} color="#2563eb" strokeWidth={2} />
                                    </div>
                                    <div className="card-content">
                                        <h3>Filtro de Alérgenos Legal</h3>
                                        <p>
                                            Cumple con el Reglamento 1169/2011. Tus clientes podrán filtrar la carta para ver solo lo que pueden comer (Sin Gluten, Sin Lactosa, etc.).
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2: Translation */}
                                <div className="advantage-card card-languages">
                                    <div className="card-gradient-header"></div>
                                    <div className="icon-wrapper">
                                        <Languages size={32} color="#7c3aed" strokeWidth={2} />
                                    </div>
                                    <div className="card-content">
                                        <h3>Traducción Automática</h3>
                                        <p>
                                            ¿Turistas? No hay problema. Tu carta se traduce al inglés automáticamente al escanear el QR.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3: Real-time Editing */}
                                <div className="advantage-card card-realtime">
                                    <div className="card-gradient-header"></div>
                                    <div className="icon-wrapper">
                                        <Edit size={32} color="#ec4899" strokeWidth={2} />
                                    </div>
                                    <div className="card-content">
                                        <h3>Edición en Tiempo Real</h3>
                                        <p>
                                            ¿Has subido el precio de la cerveza? No necesitas volver a subir la foto ni reimprimir el QR. Editas el precio en tu panel y se actualiza al momento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. FINAL CTA SECTION */}
                        <section className="final-cta">
                            <div className="cta-box">
                                <h2>
                                    Prueba la IA ahora mismo
                                </h2>
                                <p>
                                    Sube una foto de tu menú y mira cómo queda en 30 segundos. Sin registro.
                                </p>
                                <Button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    size="lg"
                                    className="cta-button"
                                >
                                    Subir foto ahora
                                </Button>
                            </div>
                        </section>
                    </>
                )}

            </main>

            <ConversionModal
                isOpen={showConversionModal}
                onClose={() => setShowConversionModal(false)}
                itemCount={analyzedItems.length}
                analyzedItems={analyzedItems}
                analyzedCategories={categories}
            />
        </div>
    );
}
