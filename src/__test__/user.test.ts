import mongoose from "mongoose";
import * as UserService from "../services/user.service";
import * as SessionService from "../services/session.service";
import supertest from "supertest";
import createServer from "../server";
import { createUserSessionHandler } from "../controllers/session.controller";

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const userInput = {
  email: "test@example.com",
  name: "Jane Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe("user", () => {

  //user registration
  describe("user registration", () => { 
    describe("given the username and password are valid", () => { 
      it("should return a user payload", async () => { 
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValue(userPayload);
        
        const { statusCode, body } = await supertest(app).post("/api/register").send(userInput);
        
        expect(statusCode).toBe(200);

        expect(body).toEqual(userPayload)

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      })
    })
  })

  describe("given the password do not match", () => { 
    it("should return a 400 error", async () => { 
      const createUserServiceMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockReturnValue(userPayload);
      
      const { statusCode } = await supertest(app).post("/api/register").send({ ...userInput, passwordConfirmation: "does not match" })
      
      expect(statusCode).toBe(400);
      expect(createUserServiceMock).not.toHaveBeenCalled();
    })
  })

  describe("given the email is already in use", () => { 
    it("should return a 409 error", async () => { 
      const createUserServiceMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockRejectedValueOnce("Oh no this email is already in use :(");
      
      const { statusCode } = await supertest(app).post("/api/register").send(userInput)
      
      expect(statusCode).toBe(409);

      expect(createUserServiceMock).toHaveBeenCalled();
    })
  })

  //login user
  describe("create user session", () => {
    describe("given the email and password are valid", () => { 
      it("should return a signed accessToken & refreshToken", async () => { 
        jest
          .spyOn(UserService, "validatePassword")
          // @ts-ignore
          .mockReturnValue(userPayload);
        
        jest
          .spyOn(SessionService, "createSession")
           // @ts-ignore
          .mockReturnValue(sessionPayload);
        
        const req = {
          get: () => {
            return "a user agent";
          },

          body: {
            email: "test@example.com",
            password: "Password123",
          }
        }

        const send = jest.fn();

        const res = {
          send,
        }

        // @ts-ignore
        await createUserSessionHandler(req, res)
        
         expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      })
    })
  })
})
