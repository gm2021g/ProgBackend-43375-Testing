import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { genFakerProduct } from "../../utils/products.mock.js";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing products endpoint", () => {
  describe("GET/api/products", () => {
    it("GET --> status 200", async () => {
      const { status } = await requester.get("/api/products");

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET --> array", async () => {
      const { _body } = await requester.get("/api/products");

      expect(_body.payload).to.be.an("array").that.is.not.empty;
    });
  });

  describe("GET/api/products/:pid", () => {
    const pid = "64e97b75cee5f4536835a6c9";

    it("GET --> status 200 ", async () => {
      const { status } = await requester.get(`/api/products/${pid}`);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET --> object is pid is defined", async () => {
      const { _body } = await requester.get(`/api/products/${pid}`);

      expect(_body.payload).to.exist.and.to.be.an("object");
    });

    it("GET payload object debe tener una property _id", async () => {
      const { _body } = await requester.get(`/api/products/${pid}`);

      expect(_body.payload).to.haveOwnProperty("_id");
    });

    it("GET --> status 400 si pid no esta definido", async () => {
      const { status } = await requester.get(`/api/products/1234567890`);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("POST/api/products", () => {
    const userAccount = {
      email: "pepe@gmail.com",
      password: "pepe123",
    };
    const newProductWithoutProperties = {
      title: "Product one",
    };
    let cookieName, cookieToken, newProduct;

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);

      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];
      newProduct = genFakerProduct();
    });

    it("POST --> status 200 si todo los datos ok y guardar en la BD", async () => {
      const { _body, status } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProduct);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST a new product --> status 400 si alguna prop no esta definida", async () => {
      const { status } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProductWithoutProperties);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
