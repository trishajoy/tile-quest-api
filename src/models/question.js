// Model = the JavaScript view of ONE table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Question',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      level_id: { type: DataTypes.INTEGER, allowNull: false },
      prompt: { type: DataTypes.TEXT, allowNull: false },
      explanation: { type: DataTypes.TEXT, allowNull: true },
      position: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'questions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
