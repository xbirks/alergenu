import type { Restaurant } from './types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Gourmet Place',
    menu: [
      {
        id: 'starters',
        name: 'Starters',
        items: [
          {
            id: '101',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with our homemade Caesar dressing, croutons, and parmesan cheese.',
            price: 9.50,
            allergens: ['gluten', 'fish', 'milk', 'eggs'],
            traces: ['mustard'],
            imageId: 'caesar-salad',
            lastUpdated: '2024-05-20T10:00:00Z',
          },
          {
            id: '102',
            name: 'Sushi Platter',
            description: 'A selection of fresh nigiri and maki rolls.',
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
        name: 'Main Courses',
        items: [
          {
            id: '201',
            name: 'Pizza Margherita',
            description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.',
            price: 12.00,
            allergens: ['gluten', 'milk'],
            traces: [],
            imageId: 'pizza-margherita',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '202',
            name: 'Spaghetti Carbonara',
            description: 'A classic Roman pasta dish with egg, pecorino cheese, and pancetta.',
            price: 14.50,
            allergens: ['gluten', 'eggs', 'milk'],
            traces: ['celery'],
            imageId: 'spaghetti-carbonara',
            lastUpdated: '2024-05-22T12:00:00Z',
          },
          {
            id: '203',
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce on a sesame bun.',
            price: 13.00,
            allergens: ['gluten', 'milk', 'sesame', 'mustard'],
            traces: ['eggs'],
            imageId: 'cheeseburger',
            lastUpdated: '2024-05-21T09:30:00Z',
          },
           {
            id: '204',
            name: 'Seafood Paella',
            description: 'Saffron-infused rice with a mix of prawns, mussels and calamari.',
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
        name: 'Desserts',
        items: [
          {
            id: '301',
            name: 'Tiramisu',
            description: 'Coffee-soaked ladyfingers layered with a whipped mixture of eggs, sugar, and mascarpone cheese.',
            price: 7.50,
            allergens: ['gluten', 'eggs', 'milk'],
            traces: ['soybeans', 'tree-nuts'],
            imageId: 'tiramisu',
            lastUpdated: '2024-05-23T15:00:00Z',
          },
          {
            id: '302',
            name: 'Chocolate Lava Cake',
            description: 'A decadent chocolate cake with a molten chocolate center, served with a scoop of vanilla ice cream.',
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
