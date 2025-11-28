/**
 * Image Assets Configuration
 *
 * FINAL VERSION - Only products with exact matching images from figma design/items/
 * Using local assets for optimal performance:
 * - No network requests needed
 * - Instant loading
 * - Bundled with app
 * - Automatic optimization by Metro bundler
 */

export const ProductImages = {
  // High-quality images from "good imgs" folder
  mango: require('../../assets/products/good imgs/mango.png'),
  strawberry: require('../../assets/products/good imgs/strawberry.png'),
  bread: require('../../assets/products/good imgs/bread.png'),
  chicken: require('../../assets/products/good imgs/chicken.png'),
  avocadoPremium: require('../../assets/products/good imgs/avocado-premium.png'),
  
  // Other product images (regular quality)
  avocado: require('../../assets/products/avocado.png'),
  grapes: require('../../assets/products/grapes.png'),
  orange: require('../../assets/products/orange.png'),
  banana: require('../../assets/products/banana.png'),
  blueberries: require('../../assets/products/blueberries.png'),
  pomegranate: require('../../assets/products/pomegranate.png'),
  fig: require('../../assets/products/fig.png'),
  durian: require('../../assets/products/durian.png'),
};

export const BannerImages = {
  banner40: require('../../assets/banners/Banner 40%.png'),
  banner30: require('../../assets/banners/Banner 30%.png'),
  banner20: require('../../assets/banners/Banner 20%.png'),
};

/**
 * Get product image by product ID (descriptive IDs)
 */
export const getProductImage = (productId: string) => {
  const imageMap: Record<string, any> = {
    mango: ProductImages.mango,
    avocado: ProductImages.avocado,
    strawberry: ProductImages.strawberry,
    grapes: ProductImages.grapes,
    orange: ProductImages.orange,
    banana: ProductImages.banana,
    blueberries: ProductImages.blueberries,
    pomegranate: ProductImages.pomegranate,
    fig: ProductImages.fig,
    durian: ProductImages.durian,
    bread: ProductImages.bread,
    chicken: ProductImages.chicken,
    'avocado-premium': ProductImages.avocadoPremium,
  };

  return imageMap[productId] || ProductImages.mango; // Fallback to mango
};
