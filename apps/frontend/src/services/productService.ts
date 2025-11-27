import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ProductImages } from '../constants/images';
import { getImageKeyForProduct } from '../constants/productImageMapping';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageKey?: string; // Optional: Key to map to local asset
  imageUrl?: string; // Optional: External image URL (for mandatory products)
  stock: number;
}

/**
 * Get image source for a product (local asset or external URL)
 * Priority: imageKey (local) > imageUrl (external) > fallback mapping
 */
export const getProductImageSource = (product: Product) => {
  // Priority 1: If product has imageKey, use local asset
  if (product.imageKey && ProductImages[product.imageKey as keyof typeof ProductImages]) {
    return ProductImages[product.imageKey as keyof typeof ProductImages];
  }

  // Priority 2: If product has external imageUrl, return it
  if (product.imageUrl) {
    return { uri: product.imageUrl };
  }

  // Priority 3: Use smart mapping based on product name
  const imageKey = getImageKeyForProduct(product.name);
  if (imageKey && ProductImages[imageKey as keyof typeof ProductImages]) {
    return ProductImages[imageKey as keyof typeof ProductImages];
  }

  // Fallback: Return mango image
  return ProductImages.mango;
};

/**
 * Fetch all products from Firestore
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const snapshot = await getDocs(productsCollection);

    const products: Product[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const productDoc = doc(db, 'products', productId);
    const snapshot = await getDoc(productDoc);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
