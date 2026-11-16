// Model = the JavaScript view of ONE table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Answer',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      choice_id: { type: DataTypes.INTEGER, allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false },
      answered_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'answers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
