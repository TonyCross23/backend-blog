import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *        - title
 *        - content
 *        - image
 *       properties:
 *        title:
 *         type: string
 *         default: My first blog
 *        content:
 *         type: string
 *         default: This is my first blog content
 *        image:
 *         type: string
 *         default: https://example.com/image.jpg
 *     blogResponse:
 *         user:
 *          type: string
 *         _id:
 *          type: string
 *         title:
 *          type: string
 *         content:
 *          type: string
 *         image:
 *          type: string
 *         blogId:
 *          type: string
 *         createdAt:
 *          type: string
 *         updatedAt:
 *          type: string
 *         __v:
 *          type: number
 */
const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
  }),
};

const params = object({
  params: object({
    blogId: string({
      required_error: "Blog id is required",
    }),
  }),
});

export const createBlogSchema = object({
  ...payload,
});

export const updateBlogSchema = object({
  body: payload.body,
  params: params.shape.params,
});

export const deleteProductSchema = object({
  ...params.shape,
});

export type CreateBlogInput = TypeOf<typeof createBlogSchema>;
export type UpdateBlogInput = TypeOf<typeof updateBlogSchema>;
export type DeleteBlogInput = TypeOf<typeof deleteProductSchema>;
