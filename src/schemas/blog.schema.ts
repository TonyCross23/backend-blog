import { object, string, TypeOf } from "zod";


const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
    image: string({
      required_error: "Image is required",
    }),
  })
}

//const params = object({
//  params: object({
//    blogId: string({
//      required_error: "Blog id is required",
//    }),
//  }),
//});


export const createBlogSchema = object({
  ...payload,
});

export type CreateBlogInput = TypeOf<typeof createBlogSchema>;
