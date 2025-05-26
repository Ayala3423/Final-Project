const { sequelize } = require('./models');

sequelize.sync({ alter: true })  // או { force: true } לפורמט מחדש
  .then(() => {
    console.log('All models were synchronized successfully.');
  });
