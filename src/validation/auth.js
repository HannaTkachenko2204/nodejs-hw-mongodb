import Joi from 'joi';

export const registerUserSchema = Joi.object({ // створюємо схему для валідації
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
}),
  email: Joi.string().pattern(/.+@.+\..+/, 'Please fill a valid email address').required().messages({
    'string.base': 'Email should be a string',
    'string.pattern.name': 'Please fill a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string',
    'any.required': 'Password is required',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(/.+@.+\..+/, 'Please fill a valid email address').required().messages({
    'string.base': 'Email should be a string',
    'string.pattern.name': 'Please fill a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string',
    'any.required': 'Password is required',
  }),
});