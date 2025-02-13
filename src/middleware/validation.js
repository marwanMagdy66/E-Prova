import { Types } from "mongoose";

export const validate = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      const validationError = new Error(errors.join(", "));
      validationError.status = 400;
      return next(validationError);
    }
    return next();
  };
};

export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return helper.message("invalid Object !");
};
