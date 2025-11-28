import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Add missing products (bread, chicken, avocado-premium) to Firestore
 * This function can be called to add products that have high-quality images
 */
export async function addMissingProducts() {
  try {
    const productsCollection = collection(db, 'products');

    const missingProducts = [
      {
        id: 'bread',
        name: 'Fresh Bread',
        description:
          'Artisan bread with crispy crust and soft interior, perfect for breakfast and sandwiches.',
        price: 3.49,
        imageKey: 'bread',
        stock: 25,
      },
      {
        id: 'chicken',
        name: 'Fresh Chicken',
        description:
          'Premium organic chicken, tender and juicy, perfect for healthy meals and grilling.',
        price: 8.99,
        imageKey: 'chicken',
        stock: 20,
      },
      {
        id: 'avocado-premium',
        name: 'Premium Avocado',
        description:
          'Organic premium avocado with rich, buttery texture, ideal for gourmet dishes and salads.',
        price: 5.99,
        imageKey: 'avocadoPremium',
        stock: 18,
      },
    ];

    const results = [];

    for (const product of missingProducts) {
      // Check if product already exists
      const productDoc = doc(productsCollection, product.id);
      const existingDoc = await getDoc(productDoc);

      if (!existingDoc.exists()) {
        await setDoc(productDoc, product);
        results.push({ id: product.id, name: product.name, action: 'added' });
        console.log(`✅ Added ${product.name} (${product.id})`);
      } else {
        results.push({ id: product.id, name: product.name, action: 'exists' });
        console.log(`ℹ️  ${product.name} (${product.id}) already exists`);
      }
    }

    return {
      success: true,
      results,
      message: `Processed ${missingProducts.length} products`,
    };
  } catch (error) {
    console.error('❌ Error adding missing products:', error);
    throw error;
  }
}

