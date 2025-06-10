const { faker } = require('@faker-js/faker');
const sequelize = require('./config/sequelize');
const User = require('./models/User');
const Parking = require('./models/Parking');
const Report = require('./models/Report');

async function seedReports() {
  try {
    await sequelize.sync();

    console.log('🔍 Fetching users and parkings...');
    const users = await User.findAll();
    const parkings = await Parking.findAll();

    if (users.length < 2 || parkings.length === 0) {
      console.log('❌ Need at least 2 users and 1 parking to create reports.');
      process.exit(1);
    }

    console.log('📝 Creating reports...');
    for (let i = 0; i < 50; i++) {
      let reporter = faker.helpers.arrayElement(users);
      let reportedUser = faker.helpers.arrayElement(users);

      // למנוע מצב של דיווח עצמי
      while (reporter.id === reportedUser.id) {
        reportedUser = faker.helpers.arrayElement(users);
      }

      const parking = faker.helpers.arrayElement(parkings);

      await Report.create({
        reporterId: reporter.id,
        reportedUserId: reportedUser.id,
        parkingId: parking.id,
        rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
        description: faker.lorem.sentence()
      });
    }

    console.log('✅ Done seeding reports!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reports:', error);
    process.exit(1);
  }
}

seedReports();
