import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * FINAL Product Data - Only products with exact matching images
 *
 * Images from figma design/items/ folder:
 * - mango.png, avocado.png, strawberry.png, grapes.png, orange.png
 * - banana.png, blueberries.png, pomegranate.png, fig.png
 *
 * Stock levels: 22, 24, 19, 17, 22, 24, 19, 17, 22
 */

const products = [
  {
    id: 'mango',
    name: 'Fresh Mango',
    description:
      'Sweet and juicy tropical mango, rich in vitamins and perfect for snacking.',
    price: 3.99,
    imageKey: 'mango',
    stock: 22,
  },
  {
    id: 'avocado',
    name: 'Ripe Avocado',
    description:
      'Creamy avocado with smooth texture, ideal for salads, toast, and smoothies.',
    price: 4.5,
    imageKey: 'avocado',
    stock: 24,
  },
  {
    id: 'strawberry',
    name: 'Fresh Strawberries',
    description: 'Sweet and tangy strawberries, packed with antioxidants and vitamin C.',
    price: 5.99,
    imageKey: 'strawberry',
    stock: 19,
  },
  {
    id: 'grapes',
    name: 'Red Grapes',
    description:
      'Seedless red grapes with natural sweetness, perfect for snacking anytime.',
    price: 4.25,
    imageKey: 'grapes',
    stock: 17,
  },
  {
    id: 'orange',
    name: 'Sweet Orange',
    description: 'Juicy oranges bursting with flavor, excellent source of vitamin C.',
    price: 3.5,
    imageKey: 'orange',
    stock: 22,
  },
  {
    id: 'banana',
    name: 'Ripe Banana',
    description: 'Yellow bananas with perfect ripeness, great for energy and potassium.',
    price: 2.99,
    imageKey: 'banana',
    stock: 24,
  },
  {
    id: 'blueberries',
    name: 'Fresh Blueberries',
    description:
      'Plump blueberries loaded with antioxidants, perfect for breakfast bowls.',
    price: 6.99,
    imageKey: 'blueberries',
    stock: 19,
  },
  {
    id: 'pomegranate',
    name: 'Fresh Pomegranate',
    description: 'Ruby red pomegranate seeds with sweet-tart flavor and health benefits.',
    price: 5.5,
    imageKey: 'pomegranate',
    stock: 17,
  },
  {
    id: 'fig',
    name: 'Fresh Fig',
    description:
      'Sweet and tender figs with unique flavor, perfect for desserts and cheese platters.',
    price: 7.99,
    imageKey: 'fig',
    stock: 22,
  },
];

export async function seedProducts() {
  try {
    const productsCollection = collection(db, 'products');

    for (const product of products) {
      await setDoc(doc(productsCollection, product.id), product);
    }

    return { success: true, count: products.length };
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}
