import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string', // кастомізація повідомлення для типу "string"
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string()
    .min(3)
    .max(20)
    .pattern(/.+@.+\..+/, 'Please fill a valid email address')
    .messages({
      'string.base': 'Email should be a string',
      'string.min': 'Email should have at least {#limit} characters',
      'string.max': 'Email should have at most {#limit} characters',
      'string.pattern.name': 'Please fill a valid email address',
    }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Favourite status should be a boolean',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact type should be a string',
      'any.only':
        'Contact type must be one of the following: work, home, personal',
      'any.required': 'Contact type is required',
    }),
  // userId: Joi.string().required().messages({ // дає можливість при створенні студента вказувати звʼязок між колекціями users та students
  //   'string.base': 'User id should be a string',
  //   'any.required': 'User id is required',
  // }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
  email: Joi.string()
    .min(3)
    .max(20)
    .pattern(/.+@.+\..+/, 'Please fill a valid email address')
    .messages({
      'string.base': 'Email should be a string',
      'string.min': 'Email should have at least {#limit} characters',
      'string.max': 'Email should have at most {#limit} characters',
      'string.pattern.name': 'Please fill a valid email address',
    }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Favourite status should be a boolean',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type should be a string',
    'any.only':
      'Contact type must be one of the following: work, home, personal',
  }),
});
