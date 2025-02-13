import joi from "joi";

export const register = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(8).max(20).required(),
    confirmPassword: joi.string().min(8).max(20).required(),
    phone: joi
      .string()
      .min(10)
      .max(15)
      .pattern(/^01[0-2,5]{1}[0-9]{8}$/),
    role: joi.string().valid("admin", "customer").required(),
    address: joi.string().required(),
    gender: joi.string().valid("male", "female").required(),
  })
  .required();

export const activate = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const login = joi
  .object({
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(8).max(20).required(),
  })
  .required();

export const forgetCode = joi
  .object({
    email: joi.string().email().required().lowercase(),
  })
  .required();

export const resetPassword = joi
  .object({
    email: joi.string().email().required().lowercase(),
    code: joi.string().min(6).max(6).required(),
    password: joi.string().min(8).max(20).required(),
    confirmPassword: joi.string().min(8).max(20).required(),
  })
  .required();
