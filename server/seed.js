const { faker } = require('@faker-js/faker');
const sequelize = require('./config/sequelize');
const User = require('./models/User');
const Parking = require('./models/Parking');
const TimeSlot = require('./models/TimeSlot');
const Message = require('./models/Message');

async function seed() {
  try {

    console.log('🔄 Creating users...');
    const users = [];
    const usernamesSet = new Set();

    while (users.length < 100) {
      const rawUsername = faker.internet.userName();
      const username = usernamesSet.has(rawUsername)
        ? `${rawUsername}_${faker.string.alphanumeric(4)}`
        : rawUsername;

      if (usernamesSet.has(username)) continue;
      usernamesSet.add(username);

      const role = users.length % 3 === 0 ? 'admin' : users.length % 2 === 0 ? 'owner' : 'renter';

      const user = await User.create({
        name: faker.person.fullName(),
        username,
        phone: `050-${faker.number.int({ min: 1000000, max: 9999999 })}`,
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        role,
        averageRating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
      });

      users.push(user);
    }

    console.log('🏠 Creating parkings...');
    const parkings = [];
    const owners = users.filter(u => u.role === 'owner');

    for (const owner of owners) {
      const count = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < count; i++) {
        const parking = await Parking.create({
          ownerId: owner.id,
          latitude: faker.number.float({ min: 31.7, max: 31.8, precision: 0.00001 }),
          longitude: faker.number.float({ min: 35.2, max: 35.3, precision: 0.00001 }),
          address: faker.location.streetAddress(),
          description: faker.lorem.sentence(),
          averageRating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
          imageUrl: faker.image.urlLoremFlickr({ category: 'transport', width: 640, height: 480 }),
        });
        parkings.push(parking);
      }
    }

    console.log('⏰ Creating time slots...');
    for (const parking of parkings) {
      const timeSlotCount = faker.number.int({ min: 2, max: 5 });
      for (let i = 0; i < timeSlotCount; i++) {
        const isFixed = faker.datatype.boolean();
        const type = isFixed ? 'fixed' : 'temporary';
        const date = !isFixed ? new Date().toISOString().slice(0, 10) : null;
        const dayOfWeek = isFixed ? faker.helpers.arrayElement(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']) : null;
        const recurrence = isFixed ? 'daily' : 'none';

        const now = new Date();
        const currentHour = now.getHours();
        const startHour = currentHour - 1 >= 0 ? currentHour - 1 : 0;
        const endHour = currentHour + 3 <= 23 ? currentHour + 9 : 23;

        const startTime = `${startHour.toString().padStart(2, '0')}:00`;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;

        await TimeSlot.create({
          parkingId: parking.id,
          type,
          date,
          dayOfWeek,
          recurrence,
          startTime,
          endTime,
          isRented: false,
          price: faker.number.float({ min: 10, max: 40, precision: 0.5 }),
        });
      }
    }

    console.log('💬 Creating messages...');
    const messageCount = 200;

    for (let i = 0; i < messageCount; i++) {
      const sender = faker.helpers.arrayElement(users);
      let receiver;
      do {
        receiver = faker.helpers.arrayElement(users);
      } while (receiver.id === sender.id);

      await Message.create({
        senderId: sender.id,
        receiverId: receiver.id,
        content: faker.lorem.sentences({ min: 1, max: 3 }),
        sentAt: faker.date.recent({ days: 10 }),
        isRead: faker.datatype.boolean(),
        conversationId: null, // ניתן להוסיף לוגיקה קבוצתית בעתיד
      });
    }

    console.log('✅ Done seeding with faker!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seed();
