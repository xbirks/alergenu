import type { Restaurant } from './types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Gourmet Place',
    menu: [
      {
        id: 'starters',
        name: 'Entrantes',
        items: [
          {
            id: '101',
            name: 'Ensalada César',
            description: 'Lechuga romana crujiente con nuestro aderezo César casero, picatostes y queso parmesano.',
            price: 9.50,
            allergens: ['gluten', 'fish', 'milk', 'eggs'],
            traces: ['mustard'],
            imageId: 'caesar-salad',
            lastUpdated: '2024-05-20T10:00:00Z',
          },
          {
            id: '102',
            name: 'Tabla de Sushi',
            description: 'Una selección de frescos nigiris y rollos maki.',
            price: 15.00,
            allergens: ['fish', 'gluten', 'soybeans', 'sesame'],
            traces: ['crustaceans'],
            imageId: 'sushi-platter',
            lastUpdated: '2024-05-21T11:00:00Z',
          }
        ],
      },
      {
        id: 'mains',
        name: 'Platos Principales',
        items: [
          {
            id: '201',
            name: 'Pizza Margherita',
            description: 'Pizza clásica con salsa de tomate, mozzarella y albahaca fresca.',
            price: 12.00,
            allergens: ['gluten', 'milk'],
            traces: [],
            imageId: 'pizza-margherita',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '202',
            name: 'Spaghetti Carbonara',
            description: 'Un plato de pasta clásico romano con huevo, queso pecorino y panceta.',
            price: 14.50,
            allergens: ['gluten', 'eggs', 'milk'],
            traces: ['celery'],
            imageId: 'spaghetti-carbonara',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '203',
            name: 'Hamburguesa con Queso Clásica',
            description: 'Jugosa carne de res con queso cheddar, lechuga, tomate y nuestra salsa especial en un pan de sésamo.',
            price: 13.00,
            allergens: ['gluten', 'milk', 'sesame', 'mustard'],
            traces: ['eggs'],
            imageId: 'cheeseburger',
            lastUpdated: '2024-05-21T09:30:00Z',
          },
           {
            id: '204',
            name: 'Paella de Marisco',
            description: 'Arroz con azafrán y una mezcla de gambas, mejillones y calamares.',
            price: 19.00,
            allergens: ['crustaceans', 'molluscs', 'fish'],
            traces: ['sulphites'],
            imageId: 'seafood-paella',
            lastUpdated: '2024-05-23T14:00:00Z',
          }
        ],
      },
      {
        id: 'desserts',
        name: 'Postres',
        items: [
          {
            id: '301',
            name: 'Tiramisú',
            description: 'Bizcochos de soletilla empapados en café y capas de una mezcla batida de huevos, azúcar y queso mascarpone.',
            price: 7.50,
            allergens: ['gluten', 'eggs', 'milk'],
            traces: ['soybeans', 'tree-nuts'],
            imageId: 'tiramisu',
            lastUpdated: '2024-05-23T15:00:00Z',
          },
          {
            id: '302',
            name: 'Pastel de Chocolate Volcán',
            description: 'Un delicioso pastel de chocolate con un centro de chocolate fundido, servido con una bola de helado de vainilla.',
            price: 8.00,
            allergens: ['gluten', 'eggs', 'milk', 'soybeans'],
            traces: ['peanuts', 'tree-nuts'],
            imageId: 'chocolate-cake',
            lastUpdated: '2024-05-23T15:00:00Z',
          }
        ],
      },
    ],
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}
