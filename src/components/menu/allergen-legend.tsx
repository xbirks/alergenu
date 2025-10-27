'use client';

import { ALLERGENS, Allergen } from '@/lib/allergens';
import { AllergenIconDisplay } from './allergen-icon-display';

const staticTexts = {
    title: { es: 'Leyenda de alérgenos', en: 'Allergen Legend' },
    intro: { 
        es: 'Iconos utilizados para identificar la presencia de alérgenos en nuestros platos.',
        en: 'Icons used to identify the presence of allergens in our dishes.'
    },
    tracesTitle: { es: 'Posibles trazas en el plato', en: 'Possible traces in the dish' },
    tracesIntro: { 
        es: 'Este estilo de icono indica que no podemos garantizar la ausencia de contacto cruzado con el alérgeno durante la elaboración.',
        en: 'This icon style indicates that we cannot guarantee the absence of cross-contact with the allergen during preparation.'
    }
};

export function AllergenLegend({ lang }: { lang: string }) {
    const getTranslated = (field: keyof typeof staticTexts) => {
        const texts = staticTexts[field] as { es: string; en: string };
        return texts[lang as keyof typeof texts] || texts.es;
    };

    const getAllergenName = (allergen: Allergen) => {
        if (lang === 'en') {
            return allergen.name_en;
        }
        return allergen.name;
    }

    return (
        <section className="py-16 border-t">
            <div className="grid gap-2 mb-8">
                 <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Manrope' }}>{getTranslated('title')}</h2>
                 <p className="text-gray-600">{getTranslated('intro')}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 mb-12">
                {ALLERGENS.map(allergen => (
                    <div key={allergen.id} className="flex items-center gap-3">
                        <AllergenIconDisplay allergenId={allergen.id} type="contains" size="medium" lang={lang} />
                        <span className="font-medium text-gray-700">{getAllergenName(allergen)}</span>
                    </div>
                ))}
            </div>

            <div className="grid gap-2 mb-6">
                 <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Manrope' }}>{getTranslated('tracesTitle')}</h3>
                 <p className="text-gray-600">{getTranslated('tracesIntro')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
                {ALLERGENS.map(allergen => (
                    <AllergenIconDisplay key={allergen.id} allergenId={allergen.id} type="traces" size="medium" lang={lang} />
                ))}
            </div>
        </section>
    );
}
