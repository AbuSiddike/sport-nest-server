const { jwtVerify, createRemoteJWKSet } = require("jose-cjs");
const AppError = require("../utils/AppError");

async function validateToken(token) {
  try {
    const JWKS = createRemoteJWKSet(new URL(`${process.env.FRONTEND_BASE_URL}/api/auth/jwks`));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${process.env.FRONTEND_BASE_URL}`,
      audience: `${process.env.FRONTEND_BASE_URL}`,
    });
    return payload;
  } catch (error) {
    console.error("Token validation failed:", error);
    throw error;
  }
}

function extractToken(req) {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  return null;
}

async function authenticate(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = await validateToken(token);

    if (!payload.email) {
      throw new AppError("Invalid token payload", 401);
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Invalid or expired token", 401));
  }
}

module.exports = authenticate;
