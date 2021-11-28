export default (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
      login: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      hashPassword: {
        type: Sequelize.STRING,
        allowNull: false
      }
  });
  
  return User;
}