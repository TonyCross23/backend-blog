import supertest from "supertest";
import createServer from "../server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createBlog } from "../services/blog.service";
import { signJwt } from "../utils/jwt.util";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString()

export const blogPayload = {
    user: userId,
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    content: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    image: "https://i.imgur.com/QlRphfQ.jpg"
}

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

describe("blog", () => {

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  })

  describe('get blog route', () => {

    describe('given the blog does not exist', () => {
      it("should return a 404", async () => {
        const blogId = "blog-1234";
        await supertest(app).get(`/api/blog/${blogId}`).expect(404)
      })
    })

    describe('given the blog does exist', () => {
      it("should return a 200 status and the blog", async () => {
        const blog = await createBlog(blogPayload)

        const { body, statusCode } = await supertest(app).get(`/api/blog/${blog.blogId}`).expect(200)
        
        expect(statusCode).toBe(200)
        expect(body.blogId).toEqual(blog.blogId)
      })
    })
  })
  
  describe('get all blogs route', () => {
    it("should return a 200 status and an array of blogs", async () => {
      const { body, statusCode } = await supertest(app).get('/api/blogs').expect(200)

      expect(statusCode).toBe(200)
      expect(body).toBeInstanceOf(Array)
    })
  })

  describe('create blog route', () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post('/api/blog').send(blogPayload).expect(403)
        
        expect(statusCode).toBe(403)
      })
     })
  })
  
  describe.skip("given the user is logged in", () => { 
    it("should return a 201 status and the created blog", async () => { 
      const jwt = signJwt(userPayload)

      const { statusCode, body } = await supertest(app).post("/api/blog").set("Authorization", `Bearer ${jwt}`).send(blogPayload).expect(201)
      
      expect(statusCode).toBe(200);

      expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          content:
            "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
          //image: "https://i.imgur.com/QlRphfQ.jpg",
          blogId: expect.any(String),
          title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
          updatedAt: expect.any(String),
          user: expect.any(String),
      })
    })
  })

})
