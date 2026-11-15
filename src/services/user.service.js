'use strict';

const { notFound } = require('../errors/app-error');
const userRepository = require('../repositories/user.repository');

async function listAll() {
  return userRepository.findAll();
}

async function changeRole(userId, role) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw notFound('USER_NOT_FOUND', `No account with id ${userId}.`);
  }
  return userRepository.update(user, { role });
}

module.exports = { listAll, changeRole };
