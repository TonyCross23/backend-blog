import { object, string, TypeOf } from "zod";


const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
  })
}

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
