// Model = the JavaScript view of ONE table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Choice',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      choice_text: { type: DataTypes.STRING(255), allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'choices',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
