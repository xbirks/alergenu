'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MenuUploadHeroProps {
    onFileSelected: (file: File) => void;
    isAnalyzing: boolean;
}

export function MenuUploadHero({ onFileSelected, isAnalyzing }: MenuUploadHeroProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Notify parent (but don't start analysis automatically)
        onFileSelected(file);
    }, [onFileSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled: isAnalyzing,
    });

    return (
        <div className="max-w-4xl mx-auto">
            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer',
                    'bg-white',
                    isDragActive && 'border-blue-600 bg-blue-50 scale-105',
                    !isDragActive && 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50',
                    isAnalyzing && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="space-y-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        {!isAnalyzing && (
                            <p className="text-center text-lg text-muted-foreground">
                                Haz clic o arrastra otra imagen para cambiarla
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-6">
                            <Upload className="w-16 h-16 mx-auto text-blue-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {isDragActive ? '¡Suelta la imagen aquí!' : 'Subir fotos de la carta'}
                        </h3>

                        <p className="text-lg text-muted-foreground mb-6">
                            Arrastra tu imagen aquí o selecciónala
                        </p>

                        <Button
                            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 py-6 text-lg rounded-full mb-8 shadow-md hover:shadow-lg transition-all"
                        >
                            Subir foto
                        </Button>

                        <div className="block text-sm text-muted-foreground">
                            <span>JPG, PNG o WEBP • Máximo 10MB</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Compact Disclaimer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    <strong>Consejo:</strong> Foto clara y legible • Buena iluminación sin sombras • Si es muy larga, súbela por secciones
                </p>
            </div>
        </div>
    );
}
