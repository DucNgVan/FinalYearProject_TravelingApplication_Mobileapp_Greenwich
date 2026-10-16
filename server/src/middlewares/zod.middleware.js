/**
 * Zod Validation Middleware for Express
 * Validates request payload/query against Zod schemas and outputs standard Nomadix envelopes.
 */
function validateZod(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const details = issues.map(err => ({
        field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issues[0]?.message || 'Validation failed',
          details,
        },
      });
    }

    req.validatedBody = result.data;
    req.body = result.data;
    return next();
  };
}

function validateZodQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      const details = issues.map(err => ({
        field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issues[0]?.message || 'Query validation failed',
          details,
        },
      });
    }

    req.validatedQuery = result.data;
    req.query = result.data;
    return next();
  };
}

module.exports = {
  validateZod,
  validateZodQuery,
};
