'use strict';

// Translates between HTTP and the service. No SQL, no business rules.
// req.body never appears here: validated input comes from matchedData.
const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');

function toJson(user) {
  const u = user.toJSON ? user.toJSON() : user;
  // password_hash never leaves the database (defaultScope excludes it).
  delete u.password_hash;
  return u;
}

async function register(req, res) {
  const input = matchedData(req, { locations: ['body'] });
  const user = await authService.register(input);
  res.status(201).json({ user: toJson(user) });
}

async function login(req, res) {
  const input = matchedData(req, { locations: ['body'] });
  const result = await authService.login(input);
  res.status(200).json({
    token: result.token,
    token_type: result.token_type,
    expires_in: result.expires_in,
    user: toJson(result.user),
  });
}

async function me(req, res) {
  res.status(200).json({ user: toJson(req.account) });
}

module.exports = { register, login, me };
