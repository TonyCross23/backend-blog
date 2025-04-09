import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string({ required_error: "name is required" }).min(1),
  email: z.string({ required_error: "email is required" }).email(),
  password: z.string({ required_error: "password is required" }).min(6),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
