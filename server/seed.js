import { User, Parking, TimeSlot, Reservation, Report, Passwords, Message } from './models/index.js';
import { faker } from '@faker-js/faker';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const createUsers = async () => {
  const plainPasswords = [
    { username: "admin", password: "1" },
    { username: "johnd", password: "1" },
    { username: "sarahlevi", password: "1" },
    { username: "davidc", password: "1" },
    { username: "miriama", password: "1" }
  ];

  const usersData = [
    { name: "Admin User", username: "admin", role: "admin", email: "admin@example.com", phone: "0501234567", address: "Jerusalem", profileImage: "default-profile.png" },
    { name: "John Doe", username: "johnd", role: "renter", email: "john@example.com", phone: "0507654321", address: "Beit Hakerem, Jerusalem", profileImage: "default-profile.png" },
    { name: "Sarah Levi", username: "sarahlevi", role: "renter", email: "sarah@example.com", phone: "0521112233", address: "Katamon, Jerusalem", profileImage: "default-profile.png" },
    { name: "David Cohen", username: "davidc", role: "owner", email: "david@example.com", phone: "0533334444", address: "Gilo, Jerusalem", profileImage: "default-profile.png" },
    { name: "Miriam Azulay", username: "miriama", role: "owner", email: "miriam@example.com", phone: "0545556666", address: "Pisgat Ze'ev, Jerusalem", profileImage: "default-profile.png" }
  ];

  const users = await User.bulkCreate(usersData, { returning: true });

  const passwords = await Promise.all(users.map(async user => {
    const plain = plainPasswords.find(p => p.username === user.username)?.password || "password123";
    const hash = await bcrypt.hash(plain, 10);
    return {
      userId: user.id,
      hash: hash
    };
  }));

  await Passwords.bulkCreate(passwords);
};


const jerusalemAddresses = [
  { address: "Ben Yehuda St 1", lat: 31.781, lon: 35.219 },
  { address: "Jaffa St 45", lat: 31.784, lon: 35.213 },
  { address: "King George St 20", lat: 31.7812, lon: 35.216 },
  { address: "Hillel St 15", lat: 31.7798, lon: 35.2195 },
  { address: "Emek Refaim St 32", lat: 31.761, lon: 35.215 },
  { address: "Pierre Koenig St 17", lat: 31.753, lon: 35.212 },
  { address: "Bar Ilan St 10", lat: 31.807, lon: 35.212 },
  { address: "Yirmiyahu St 28", lat: 31.796, lon: 35.205 },
  { address: "Herzl Blvd 91", lat: 31.773, lon: 35.181 },
  { address: "Ramat Sharet 5", lat: 31.755, lon: 35.186 }
];

const createMessages = async () => {
  const messages = [];

  // נניח ניצור שיחות בין renter ל-owner
  const conversations = [
    { senderId: 2, receiverId: 4 }, // John -> David
    { senderId: 3, receiverId: 5 }, // Sarah -> Miriam
  ];

  for (const convo of conversations) {
    const conversationId = faker.string.uuid();

    // ניצור 5 הודעות לכל שיחה
    for (let i = 0; i < 5; i++) {
      const isRead = faker.datatype.boolean();
      messages.push({
        senderId: i % 2 === 0 ? convo.senderId : convo.receiverId,
        receiverId: i % 2 === 0 ? convo.receiverId : convo.senderId,
        content: faker.lorem.sentence(),
        sentAt: faker.date.recent(10),
        isRead,
        conversationId
      });
    }
  }

  await Message.bulkCreate(messages);
};

const createParkings = async () => {
  const parkings = [];
  for (let i = 0; i < 20; i++) {
    const { address, lat, lon } = faker.helpers.arrayElement(jerusalemAddresses);
    const ownerId = i < 10 ? 4 : 5;

    parkings.push({
      ownerId,
      address,
      latitude: lat + Math.random() * 0.001,
      longitude: lon + Math.random() * 0.001,
      description: faker.lorem.sentence(),
      imageUrl: "default-parking.jpg"
    });
  }
  await Parking.bulkCreate(parkings);
};

const createTimeSlots = async () => {
  const allParkings = await Parking.findAll();
  const slots = [];
  const now = new Date();

  for (let parking of allParkings) {
    const fixed = Math.random() > 0.5;
    if (fixed) {
      const days = faker.helpers.arrayElements(
        ['sunday', 'monday', 'wednesday', 'thursday'],
        faker.number.int({ min: 1, max: 3 })
      );
      days.forEach(day => {
        slots.push({
          parkingId: parking.id,
          type: 'fixed',
          dayOfWeek: day,
          recurrence: 'weekly',
          startTime: '08:00',
          endTime: '14:00',
          price: faker.number.int({ min: 10, max: 25 }),
          isAllowSubReservations: faker.datatype.boolean()
        });
      });
    } else {
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        slots.push({
          parkingId: parking.id,
          type: 'temporary',
          date: date.toISOString().split('T')[0],
          startTime: `${faker.number.int({ min: 6, max: 10 })}:00`,
          endTime: `${faker.number.int({ min: 15, max: 22 })}:00`,
          price: faker.number.int({ min: 10, max: 25 }),
          isAllowSubReservations: faker.datatype.boolean()
        });
      }
    }
  }
  console.log("✅ Total slots to create:", slots.length);
  await TimeSlot.bulkCreate(slots);
};

const createReservationsAndReports = async () => {
  const allSlots = await TimeSlot.findAll({ limit: 110 });
  const reservations = [];
  const reports = [];

  for (let i = 0; i < 30; i++) {
    const slot = faker.helpers.arrayElement(allSlots);
    const start = new Date();
    start.setHours(8 + i % 5);
    const end = new Date(start);
    end.setHours(start.getHours() + 2);

    const renterId = faker.helpers.arrayElement([2, 3]);
    const ownerId = faker.helpers.arrayElement([4, 5]);

    reservations.push({
      renterId,
      ownerId,
      parkingId: slot.parkingId,
      timeSlotId: slot.id,
      startTime: start,
      endTime: end,
      totalPrice: 30,
      reservationDate: new Date()
    });

    if (i % 2 === 0) {
      reports.push({
        reporterId: renterId,
        reportedUserId: ownerId,
        parkingId: slot.parkingId,
        rating: faker.number.float({ min: 2, max: 5, precision: 0.5 }),
        description: faker.helpers.arrayElement(["Great!", "Not clean", "Too tight", null])
      });
    }
  }

  await Reservation.bulkCreate(reservations);
  await Report.bulkCreate(reports);
};

const seed = async () => {
  try {
    await createUsers();
    await createParkings();
    await createTimeSlots();
    await createReservationsAndReports();
    await createMessages(); 

    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
};

seed();
