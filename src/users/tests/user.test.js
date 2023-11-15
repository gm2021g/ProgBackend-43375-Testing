import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { newFakerUser } from "../../utils/users.mock.js";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing auth y user endpoints", () => {
  describe("POST /login --> usuario registrado", () => {
    const userAccount = {
      email: "pepe@gmail.com",
      password: "pepe123",
    };

    it("POST/login --> cookie con jwt token", async () => {
      const response = await requester.post("/login").send(userAccount);

      const cookie = response.header["set-cookie"][0];

      expect(cookie).to.exist;
    });
  });

  describe("GET/current --> status 200 y usuario / propiedades", () => {
    const userAccount = {
      email: "pepe@gmail.com",
      password: "pepe123",
    };

    let cookieName, cookieToken;

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);
      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];
    });

    it("GET --> retornar status 200", async () => {
      const { status } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(status).to.exist.and.to.be.equal(200);
    });
  });
});
