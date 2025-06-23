import Category from '../models/category.model'; // Adjust the path to your Category model
import Product from '../models/product.model'; // Adjust the path to your Product model
import { DefaultData } from '../utils/data';

export async function populateDatabaseFromJSON() {
  try {
    const data = DefaultData;

    if (data.categories && Array.isArray(data.categories)) {
      for (const categoryData of data.categories) {
        if (
          categoryData.name &&
          categoryData.products &&
          Array.isArray(categoryData.products)
        ) {
          // Check and create Category
          let category = await Category.findOne({
            where: { nombre: categoryData.name },
          });

          if (!category) {
            category = await Category.create({ nombre: categoryData.name });
            console.log(`Created category: ${categoryData.name}`);
          }

          // // Check and create Products for this category
          for (const productData of categoryData.products) {
            if (productData.codigo && productData.nombre) {
              const product = await Product.findOne({
                where: { nombre: productData.nombre },
              });

              if (!product) {
                await Product.create({
                  nombre: productData.nombre,
                  codigo: productData.codigo,
                  categoriaId: category._id, // Assuming your Product model has a CategoryId foreign key
                });
                console.log(
                  `Created product: ${productData.nombre} in category ${categoryData.name}`
                );
              }
            } else {
              console.warn(
                'Skipping product with missing codigo or nombre:',
                productData
              );
            }
          }
        } else {
          console.warn('Skipping invalid category entry:', categoryData);
        }
      }
    } else {
      console.error('data.js does not contain a valid "categories" array.');
    }

    console.log('Database population from data.js complete.');
  } catch (error) {
    console.error('Error populating database from data.js:', error);
  }
}
