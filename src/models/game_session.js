// Model = the JavaScript view of ONE table.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      session_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
      level_id: { type: DataTypes.INTEGER, allowNull: false },
      started_at: { type: DataTypes.DATE, allowNull: false },
      ended_at: { type: DataTypes.DATE, allowNull: true },
      question_started_at: { type: DataTypes.DATE, allowNull: true },
      current_position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      tableName: 'game_sessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
