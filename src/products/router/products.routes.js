import express from "express";
import { authPolicies, authToken } from "../../utils/jwt.js";
import {
  getAllProductsCtr,
  getProductByIdCtr,
  addNewProductCtr,
  updateProductCtr,
  deleteProductCtr,
} from "../controller/products.controller.js";

const Router = express.Router();

//obtener todos los productos
Router.get("/", getAllProductsCtr);

//obtener un producto por id
Router.get("/:pid", getProductByIdCtr);

//agregar un producto a la base de datos
Router.post("/", authToken, authPolicies("ADMIN"), addNewProductCtr);

//modificar un producto
Router.put("/:pid", updateProductCtr);

//eliminar un producto
Router.delete("/:pid", authToken, authPolicies("ADMIN"), deleteProductCtr);

export default Router;
