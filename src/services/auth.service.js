'use strict';

const { conflict, unauthorized } = require('../errors/app-error');
const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');

// One fixed message so wrong password and unknown school ID answer identically.
const INVALID_CREDENTIALS_MESSAGE = 'Wrong school ID or password.';

// Register: hash the password and always create a PLAYER.
async function register({ school_id, full_name, email, password: plainPassword }) {
  const password_hash = await password.hash(plainPassword);

  // Pre-check for clear, specific errors.
  const bySchool = await userRepository.findBySchoolId(school_id);
  if (bySchool) {
    throw conflict('SCHOOL_ID_TAKEN', 'That school ID is already taken.');
  }

  const byEmail = await userRepository.findByEmail(email);
  if (byEmail) {
    throw conflict('EMAIL_TAKEN', 'That email address is already taken.');
  }

  try {
    return await userRepository.create({
      school_id,
      full_name,
      email,
      role: 'PLAYER',
      password_hash,
    });
  } catch (error) {
    // Race condition: a unique constraint was violated between pre-check and create.
    if (error.name === 'SequelizeUniqueConstraintError') {
      const constraint = error.parent && error.parent.constraint;
      if (constraint === 'uq_users_school_id') {
        throw conflict('SCHOOL_ID_TAKEN', 'That school ID is already taken.');
      }
      if (constraint === 'uq_users_email') {
        throw conflict('EMAIL_TAKEN', 'That email address is already taken.');
      }
    }
    throw error;
  }
}

// Login: wrong password and unknown school ID must answer identically.
async function login({ school_id, password: plain }) {
  const user = await userRepository.findForLogin(school_id);

  const ok = await password.matches(plain, user ? user.password_hash : null);
  if (!ok) {
    throw unauthorized(INVALID_CREDENTIALS_MESSAGE, 'INVALID_CREDENTIALS');
  }

  const access_token = token.issue(user);
  const expires_in = 3600; // seconds, matches JWT_EXPIRES_IN=1h

  return { token: access_token, token_type: 'Bearer', expires_in, user };
}

module.exports = {
  register,
  login,
};
