// Model = the JavaScript view of ONE table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Player',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      game_session_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING(30), allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'players',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
