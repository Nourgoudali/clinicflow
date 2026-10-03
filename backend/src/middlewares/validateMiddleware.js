const { ZodError } = require('zod');

/**
 * Validates request data against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'query'|'params'} [target='body'] - Request property to validate
 */
const validate = (schema, target = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[target]);
      req[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          message: formattedErrors[0]?.message || 'Validation error',
          errors: formattedErrors
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
