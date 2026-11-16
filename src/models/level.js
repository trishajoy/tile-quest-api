// Model = the JavaScript view of ONE table. Column rules live in the migration;
// the model only tells Sequelize how to read and write the table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Level',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      level_number: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      pass_score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 70 },
      picture: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      tableName: 'levels',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
