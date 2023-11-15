import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { generateProducts } from "../../utils/products.mock.js";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing /api/carts endpoint", () => {
  describe("POST /api/carts --> crea nuevo cart ", () => {
    it("POST --> status 200 cuando se crea un cart", async () => {
      const { status } = await requester.post("/api/carts");

      expect(status).to.exist.and.to.be.equal(200);
    });
  });

  describe("GET /api/carts/:cid si encuentra el cart retorna status 200 sino status 400", () => {
    let cid;

    before(async () => {
      cid = "6520dd512d4ba3f5c59295d2";
    });

    it("GET --> status 200", async () => {
      const { status } = await requester.get(`/api/carts/${cid}`);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET --> un cart tipo object", async () => {
      const { _body } = await requester.get(`/api/carts/${cid}`);

      expect(_body.payload).to.be.an("object");
    });

    it("GET --> status 400 si el cart no existe", async () => {
      const { status } = await requester.get(`/api/carts/y4645reehyt6546`);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("POST /api/carts/:cid", () => {
    let cid;

    const arrayOfProducts = generateProducts();

    before(async () => {
      const { _body } = await requester.post("/api/carts");
      cid = _body.payload._id;
    });

    it("POST --> status 404 si id cart no esta definido", async () => {
      const { status } = await requester
        .post(`/api/carts/1234567890`)
        .send([arrayOfProducts]);

      expect(status).to.exist.and.to.be.equal(404);
    });
  });

  describe("DELETE /api/carts/:cid", () => {
    let cid;

    const arrayOfProducts = generateProducts();

    before(async () => {
      const { _body } = await requester.post("/api/carts");

      cid = _body.payload._id;

      await requester.post(`/api/carts/${cid}`).send([arrayOfProducts]);
    });

    it("DELETE --> status 200 si se borrò el producto del cart", async () => {
      const { status } = await requester.delete(`/api/carts/${cid}`);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("DELETE --> status 400 si el cart no fue encontrado", async () => {
      const { status } = await requester.delete(`/api/carts/567890`);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
