// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'tile-quest',
  name: 'Tile Quest',
  team: 'Team 4 (3-1)',
  developer: 'trishajoy',
  description: 'Match the tiles, answer the quiz, and pass each level to keep climbing.',
  min_players: 1,
  max_players: 30,
  version: pkg.version, // read from package.json, do not edit here
};