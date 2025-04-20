import UserModel, { UserInput } from "../models/user.model";

export const createUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input);
    return user.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return null;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return user.toJSON();
};
