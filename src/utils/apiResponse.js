function sendSuccess(res, { statusCode = 200, message, data, meta } = {}) {
  const body = { success: true };

  if (message) body.message = message;
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;

  return res.status(statusCode).json(body);
}

function sendError(res, { statusCode = 500, message, errors } = {}) {
  const body = { success: false, message };

  if (errors) body.errors = errors;

  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
