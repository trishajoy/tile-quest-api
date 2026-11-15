// Translates between HTTP and the service. No SQL, no business rules.
// req.body never appears here: validated input comes from matchedData.
const { matchedData } = require('express-validator');
const levelService = require('../services/level.service');

function toJson(level) {
  const l = level.toJSON ? level.toJSON() : level;
  return l;
}

async function listLevels(req, res) {
  const input = matchedData(req, { locations: ['query'] });
  const result = await levelService.listLevels(input);
  res.status(200).json(result);
}

async function getLevel(req, res) {
  const input = matchedData(req, { locations: ['params'] });
  const { include } = matchedData(req, { locations: ['query'] }) || {};

  if (include === 'children') {
    const level = await levelService.getLevelWithQuestions(Number(input.id));
    res.status(200).json(level);
  } else {
    const level = await levelService.getLevel(Number(input.id));
    res.status(200).json(toJson(level));
  }
}

async function createLevel(req, res) {
  const input = matchedData(req, { locations: ['body'] });
  const level = await levelService.createLevel(input);
  res.status(201).json(toJson(level));
}

async function updateLevel(req, res) {
  const input = matchedData(req, { locations: ['body', 'params'] });
  const { id, ...rest } = input;
  const level = await levelService.updateLevel(Number(id), rest);
  res.status(200).json(toJson(level));
}

async function uploadLevelPicture(req, res) {
  const input = matchedData(req, { locations: ['params'] });
  const pictureUrl = `/uploads/levels/${req.file.filename}`;
  const level = await levelService.uploadPicture(Number(input.id), pictureUrl);
  res.status(200).json({ ...toJson(level), pictureUrl });
}

module.exports = { listLevels, getLevel, createLevel, updateLevel, uploadLevelPicture };
