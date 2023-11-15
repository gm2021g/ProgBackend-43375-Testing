import productsModel from "../../models/products.model.js";

class ProductsService {
  // Mostrar todos los productos con paginacion
  getProducts = async (query, options) => {
    try {
      if (query === "inStock") {
        const products = await productsModel.paginate({ state: true }, options);

        if (!products) {
          throw new Error("THE DB IS EMPTY");
        }

        return products;
      }

      if (query === "Female" || query === "Male") {
        const products = await productsModel.paginate(
          { category: query },
          options
        );

        if (!products) {
          throw new Error("THE DB IS EMPTY");
        }

        return products;
      }

      const products = await productsModel.paginate({}, options);

      if (!products) {
        throw new Error("THE DB IS EMPTY");
      }

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Mostrar un producto por id
  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById({ _id: pid }).lean();

      if (!product) {
        throw new Error("Product Not Found");
      }

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Agregar un producto
  addProduct = async (newProduct) => {
    try {
      const result = await productsModel.create(newProduct);

      if (!result) {
        throw new Error("Error to add to database");
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Actualizar un producto por id
  updateProduct = async (pid, updatedProduct) => {
    try {
      const result = await productsModel.updateOne(
        { _id: pid },
        updatedProduct
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // eliminar un producto
  deleteProduct = async (pid) => {
    try {
      const result = await productsModel.deleteOne({ _id: pid });

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateStock = async (pid, quantity) => {
    try {
      const product = await this.getProductById(pid);

      if (product.stock < quantity) {
        console.log("No stock");

        return false;
      }

      await productsModel.updateOne(
        { _id: pid },
        { $inc: { stock: -quantity } }
      );

      return true;
    } catch (error) {
      console.log(error);
    }
  };
}

export const ProductsServices = new ProductsService();
