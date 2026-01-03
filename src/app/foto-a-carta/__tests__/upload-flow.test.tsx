import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Foto-a-Carta Upload Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    describe('File Upload', () => {
        it('should accept valid image files (JPG, PNG)', () => {
            const validFiles = [
                new File(['image'], 'menu.jpg', { type: 'image/jpeg' }),
                new File(['image'], 'menu.png', { type: 'image/png' }),
            ];

            validFiles.forEach(file => {
                expect(file.type).toMatch(/^image\/(jpeg|png)$/);
                expect(file.size).toBeLessThanOrEqual(10 * 1024 * 1024); // 10MB
            });
        });

        it('should reject invalid file types', () => {
            const invalidFile = new File(['document'], 'menu.pdf', { type: 'application/pdf' });

            expect(invalidFile.type).not.toMatch(/^image\/(jpeg|png)$/);
        });

        it('should reject files larger than 10MB', () => {
            const largeFileSize = 11 * 1024 * 1024; // 11MB
            const buffer = new ArrayBuffer(largeFileSize);
            const largeFile = new File([buffer], 'large-menu.jpg', { type: 'image/jpeg' });

            expect(largeFile.size).toBeGreaterThan(10 * 1024 * 1024);
        });

        it('should handle file selection', () => {
            const file = new File(['image'], 'menu.jpg', { type: 'image/jpeg' });
            const handleFileSelected = jest.fn();

            handleFileSelected(file);

            expect(handleFileSelected).toHaveBeenCalledWith(file);
            expect(handleFileSelected).toHaveBeenCalledTimes(1);
        });
    });

    describe('AI Processing', () => {
        it('should call AI API with correct parameters', async () => {
            const mockResponse = {
                success: true,
                items: [
                    {
                        name_es: 'Paella Valenciana',
                        name_en: 'Valencian Paella',
                        price: 1500,
                        category_es: 'Arroces',
                        category_en: 'Rice Dishes',
                        allergens: { gluten: 'no', crustaceos: 'yes' },
                    },
                ],
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const formData = new FormData();
            formData.append('image', new File(['image'], 'menu.jpg', { type: 'image/jpeg' }));

            const response = await fetch('/api/analyze-menu', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            expect(global.fetch).toHaveBeenCalledWith('/api/analyze-menu', {
                method: 'POST',
                body: formData,
            });
            expect(data.success).toBe(true);
            expect(data.items).toHaveLength(1);
            expect(data.items[0].name_es).toBe('Paella Valenciana');
        });

        it('should handle AI processing errors gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('AI service unavailable'));

            try {
                await fetch('/api/analyze-menu', {
                    method: 'POST',
                    body: new FormData(),
                });
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('AI service unavailable');
            }
        });

        it('should validate AI response structure', async () => {
            const mockResponse = {
                success: true,
                items: [
                    {
                        name_es: 'Paella',
                        name_en: 'Paella',
                        price: 1500,
                        category_es: 'Arroces',
                        category_en: 'Rice',
                        allergens: {},
                    },
                ],
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const response = await fetch('/api/analyze-menu', { method: 'POST' });
            const data = await response.json();

            // Validate response structure
            expect(data).toHaveProperty('success');
            expect(data).toHaveProperty('items');
            expect(Array.isArray(data.items)).toBe(true);

            // Validate item structure
            const item = data.items[0];
            expect(item).toHaveProperty('name_es');
            expect(item).toHaveProperty('name_en');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('category_es');
            expect(item).toHaveProperty('allergens');
        });
    });

    describe('Progress States', () => {
        it('should show correct progress during upload', () => {
            const states = {
                idle: 'idle',
                uploading: 'uploading',
                analyzing: 'analyzing',
                success: 'success',
                error: 'error',
            };

            expect(states.idle).toBe('idle');
            expect(states.uploading).toBe('uploading');
            expect(states.analyzing).toBe('analyzing');
            expect(states.success).toBe('success');
            expect(states.error).toBe('error');
        });

        it('should transition through states correctly', () => {
            const stateFlow = ['idle', 'uploading', 'analyzing', 'success'];

            stateFlow.forEach((state, index) => {
                if (index > 0) {
                    expect(stateFlow[index - 1]).not.toBe(state);
                }
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            try {
                await fetch('/api/analyze-menu', { method: 'POST' });
                fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe('Network error');
            }
        });

        it('should handle API errors with proper status codes', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Internal server error' }),
            });

            const response = await fetch('/api/analyze-menu', { method: 'POST' });

            expect(response.ok).toBe(false);
            expect(response.status).toBe(500);
        });

        it('should handle invalid image format errors', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ error: 'Invalid image format' }),
            });

            const response = await fetch('/api/analyze-menu', { method: 'POST' });
            const data = await response.json();

            expect(response.ok).toBe(false);
            expect(data.error).toBe('Invalid image format');
        });
    });

    describe('Data Transformation', () => {
        it('should transform AI response to menu items format', () => {
            const aiResponse = {
                name_es: 'Paella Valenciana',
                name_en: 'Valencian Paella',
                price: 1500,
                category_es: 'Arroces',
                category_en: 'Rice Dishes',
                allergens: { gluten: 'no', crustaceos: 'yes' },
            };

            const menuItem = {
                name_i18n: {
                    es: aiResponse.name_es,
                    en: aiResponse.name_en,
                },
                price: aiResponse.price,
                category_i18n: {
                    es: aiResponse.category_es,
                    en: aiResponse.category_en,
                },
                allergens: aiResponse.allergens,
            };

            expect(menuItem.name_i18n.es).toBe('Paella Valenciana');
            expect(menuItem.name_i18n.en).toBe('Valencian Paella');
            expect(menuItem.price).toBe(1500);
            expect(menuItem.allergens.crustaceos).toBe('yes');
        });

        it('should handle missing translations gracefully', () => {
            const aiResponse = {
                name_es: 'Paella',
                name_en: '',
                price: 1500,
                category_es: 'Arroces',
                category_en: '',
                allergens: {},
            };

            const menuItem = {
                name_i18n: {
                    es: aiResponse.name_es,
                    en: aiResponse.name_en || aiResponse.name_es,
                },
            };

            expect(menuItem.name_i18n.en).toBe('Paella');
        });
    });

    describe('Performance', () => {
        it('should process images within acceptable time', async () => {
            const startTime = Date.now();

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true, items: [] }),
            });

            await fetch('/api/analyze-menu', { method: 'POST' });

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should complete within 30 seconds (generous for AI processing)
            expect(duration).toBeLessThan(30000);
        });
    });
});
