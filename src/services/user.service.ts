import UserModel, { UserInput } from "../models/user.model";

export const createUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);
    return user.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
};
