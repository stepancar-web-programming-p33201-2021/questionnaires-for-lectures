export default (sequelize, Sequelize) => {
    const Quiz = sequelize.define("quiz", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        isActive: {
           type: Sequelize.BOOLEAN,
           allowNull: false,
           default: false
        }
    });

    return Quiz;
}
