'use strict';

// Week 12: guard that a caller is logged in, and optionally that they hold one of the roles.
//     requireUser()            -> any logged-in account (req.user not null)
//     requireUser('ADMIN')     -> must be ADMIN
//     requireUser('HOST','ADMIN')-> must be HOST or ADMIN
//
// A missing token      -> 401 AUTH_REQUIRED
// A wrong role         -> 403 FORBIDDEN
const { forbidden, unauthorized } = require('../errors/app-error');

function requireUser(...allowedRoles) {
  return function requireUserMiddleware(req, res, next) {
    if (!req.user) {
      throw unauthorized('Log in first: send the header Authorization: Bearer <token>.', 'AUTH_REQUIRED');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(String(req.user.role).toUpperCase())) {
      throw forbidden('You are not allowed to do that.');
    }

    next();
  };
}

module.exports = { requireUser };
