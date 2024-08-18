import createHttpError from 'http-errors';

export const validateBody = (createContactSchema) => async (req, res, next) => {
  try {
    await createContactSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Invalid request body', {
      errors: err.details,
    });
    next(error);
  }
};