'use strict';

// Translates between HTTP and the service. No SQL, no business rules.
// req.body never appears here: validated input comes from matchedData.
const { matchedData } = require('express-validator');
const userService = require('../services/user.service');

function toJson(user) {
  const u = user.toJSON ? user.toJSON() : user;
  delete u.password_hash;
  return u;
}

async function list(req, res) {
  const users = await userService.listAll();
  res.status(200).json(users.map(toJson));
}

async function changeRole(req, res) {
  const input = matchedData(req, { locations: ['body', 'params'] });

  // An admin changing their own role is not allowed.
  if (req.user.user_id === Number(input.id)) {
    throw new (require('../errors/app-error').AppError)(
      409,
      'CANNOT_CHANGE_OWN_ROLE',
      'You cannot change your own role.'
    );
  }

  const user = await userService.changeRole(input.id, input.role);
  res.status(200).json({ user: toJson(user) });
}

module.exports = { list, changeRole };
