const { User, Parking, TimeSlot, Reservation, Report, Passwords, Message, Role, Resource, RolePermission } = require('./models');

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const createUsers = async () => {
const plainPasswords = [
  { username: "guest", password: "1" },
  { username: "admin", password: "1" },
  { username: "johnd", password: "1" },
  { username: "sarahlevi", password: "1" },
  { username: "davidc", password: "1" },
  { username: "miriama", password: "1" }
];

  const usersData = [
  { name: "Guest", username: "guest", email: "guest@example.com", phone: "0000000000", address: "Unknown", profileImage: "default-profile.png" },
  { name: "Admin User", username: "admin", email: "admin@example.com", phone: "0501234567", address: "Jerusalem", profileImage: "default-profile.png" },
  { name: "John Doe", username: "johnd", email: "john@example.com", phone: "0507654321", address: "Beit Hakerem, Jerusalem", profileImage: "default-profile.png" },
  { name: "Sarah Levi", username: "sarahlevi", email: "sarah@example.com", phone: "0521112233", address: "Katamon, Jerusalem", profileImage: "default-profile.png" },
  { name: "David Cohen", username: "davidc", email: "david@example.com", phone: "0533334444", address: "Gilo, Jerusalem", profileImage: "default-profile.png" },
  { name: "Miriam Azulay", username: "miriama", email: "miriam@example.com", phone: "0545556666", address: "Pisgat Ze'ev, Jerusalem", profileImage: "default-profile.png" }
];

  const users = await User.bulkCreate(usersData, { returning: true });

  const roles = [
  { userId: users[0].id, role: "guest" },
  { userId: users[1].id, role: "admin" },
  { userId: users[2].id, role: "renter" },
  { userId: users[3].id, role: "renter" },
  { userId: users[4].id, role: "owner" },
  { userId: users[5].id, role: "owner" },
  { userId: users[4].id, role: "renter" },
  { userId: users[5].id, role: "renter" }
];


  await Role.bulkCreate(roles);

  const passwords = await Promise.all(users.map(async user => {
    const plain = plainPasswords.find(p => p.username === user.username)?.password || "password123";
    const hash = await bcrypt.hash(plain, 10);
    return { userId: user.id, hash };
  }));

  await Passwords.bulkCreate(passwords);
};

const createResources = async () => {
  const urls = [
    // Dashboard
    { url: '/dashboard', method: 'GET', description: 'Dashboard data access' },

    // Messages
    { url: '/messages/unRead', method: 'GET', description: 'Get unread messages' },
    { url: '/messages/conversation', method: 'GET', description: 'Get messages by conversation ID' },
    { url: '/messages/conversation', method: 'PUT', description: 'Mark messages as read' },
    { url: '/messages/:id', method: 'GET', description: 'Get message by ID' },
    { url: '/messages/:id', method: 'PUT', description: 'Update message' },
    { url: '/messages/:id', method: 'DELETE', description: 'Delete message' },
    { url: '/messages', method: 'GET', description: 'Get user conversations' },
    { url: '/messages', method: 'POST', description: 'Create message' },
    { url: '/messages', method: 'ALL', description: 'Get all messages' },

    // Parkings
    { url: '/parkings/search', method: 'GET', description: 'Search parkings' },
    { url: '/parkings', method: 'GET', description: 'Get parkings by params' },
    { url: '/parkings', method: 'POST', description: 'Create parking' },
    { url: '/parkings/:id', method: 'GET', description: 'Get parking by ID' },
    { url: '/parkings/:id', method: 'PUT', description: 'Update parking' },
    { url: '/parkings/:id', method: 'DELETE', description: 'Delete parking' },
    { url: '/parkings/all', method: 'GET', description: 'Get all parkings' },

    // Payments
    { url: '/payments/confirm', method: 'POST', description: 'Confirm payment' },

    // Reports
    { url: '/reports', method: 'GET', description: 'Get reports by parking ID' },
    { url: '/reports/check', method: 'GET', description: 'Check report permission' },
    { url: '/reports/:id', method: 'GET', description: 'Get report by ID' },
    { url: '/reports/:id', method: 'PUT', description: 'Update report' },
    { url: '/reports/:id', method: 'DELETE', description: 'Delete report' },
    { url: '/reports', method: 'POST', description: 'Create report' },
    { url: '/reports', method: 'ALL', description: 'Get all reports' },

    // Reservations
    { url: '/reservations/:id', method: 'GET', description: 'Get reservation by ID' },
    { url: '/reservations/:id', method: 'PUT', description: 'Update reservation' },
    { url: '/reservations/:id', method: 'DELETE', description: 'Delete reservation' },
    { url: '/reservations', method: 'GET', description: 'Get reservations by value' },
    { url: '/reservations', method: 'POST', description: 'Create reservation' },
    { url: '/reservations', method: 'ALL', description: 'Get all reservations' },

    // TimeSlots
    { url: '/timeslots', method: 'GET', description: 'Get time slots by parking ID' },
    { url: '/timeslots/:id', method: 'GET', description: 'Get time slot by ID' },
    { url: '/timeslots/:id', method: 'PUT', description: 'Update time slot' },
    { url: '/timeslots/:id', method: 'DELETE', description: 'Delete time slot' },
    { url: '/timeslots', method: 'POST', description: 'Create time slot' },
    { url: '/timeslots', method: 'ALL', description: 'Get all time slots' },

    // Users
    { url: '/users/signup', method: 'POST', description: 'User signup' },
    { url: '/users/login', method: 'POST', description: 'User login' },
    { url: '/users/:id', method: 'GET', description: 'Get user by ID' },
    { url: '/users/:id', method: 'PUT', description: 'Update user' },
    { url: '/users/:id', method: 'DELETE', description: 'Delete user' },
    { url: '/users', method: 'GET', description: 'Get users by params' },
    { url: '/users', method: 'ALL', description: 'Get all users' },
  ];

  await Resource.bulkCreate(urls);
  console.log('✅ Resources seeded successfully');
};

const createRolePermissions = async () => {
  const roles = await Role.findAll();
  const resources = await Resource.findAll();

  const roleMap = {};
  roles.forEach(r => {
    roleMap[r.role] = r.id;
  });

  const resourceMap = {};
  resources.forEach(res => {
    resourceMap[`${res.url}:${res.method}`] = res.id;
  });

  const rolePermissionsData = [
    { role: 'admin', resourceKey: '/dashboard:GET' },
    { role: 'owner', resourceKey: '/dashboard:GET' },
    { role: 'admin', resourceKey: '/users:ALL' },
    { role: 'admin', resourceKey: '/parkings:ALL' },
    { role: 'admin', resourceKey: '/reports:ALL' },
    { role: 'admin', resourceKey: '/reservations:ALL' },
    { role: 'admin', resourceKey: '/timeslots:ALL' },

    { role: 'guest', resourceKey: '/parkings/search:GET' },
    { role: 'admin', resourceKey: '/parkings/search:GET' },
    { role: 'owner', resourceKey: '/parkings/search:GET' },
    { role: 'renter', resourceKey: '/parkings/search:GET' },
    { role: 'guest', resourceKey: '/messages:POST' },
    { role: 'admin', resourceKey: '/messages:POST' },
    { role: 'owner', resourceKey: '/messages:POST' },

    { role: 'renter', resourceKey: '/reservations:POST' },
    { role: 'renter', resourceKey: '/reservations:GET' },
    { role: 'renter', resourceKey: '/messages:POST' },

    { role: 'owner', resourceKey: '/parkings:POST' },
    { role: 'owner', resourceKey: '/timeslots:POST' },
    { role: 'owner', resourceKey: '/timeslots:GET' },
    { role: 'owner', resourceKey: '/timeslots:PUT' },
    { role: 'renter', resourceKey: '/reports:POST' },
    { role: 'renter', resourceKey: '/reports:GET' },
    { role: 'owner', resourceKey: '/reports:GET' },
    { role: 'admin', resourceKey: '/reports:GET' },
    { role: 'guest', resourceKey: '/reports:GET' },
    { role: 'owner', resourceKey: '/reservations:GET' },
  ];

  const rolePermissions = [];

  for (const rp of rolePermissionsData) {
    const roleId = roleMap[rp.role];
    const permissionId = resourceMap[rp.resourceKey];
    if (roleId && permissionId) {
      rolePermissions.push({
        roleId,
        permissionId
      });
    } else {
      console.warn(`Missing role or resource for role="${rp.role}" resource="${rp.resourceKey}"`);
    }
  }

  await RolePermission.bulkCreate(rolePermissions);
  console.log('✅ RolePermissions seeded successfully');
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

const createParkings = async () => {
  const parkings = [];
  for (let i = 0; i < 20; i++) {
    const { address, lat, lon } = faker.helpers.arrayElement(jerusalemAddresses);
    const ownerId = i < 10 ? 4 : 5; // David (4), Miriam (5)

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
  await TimeSlot.bulkCreate(slots);
};

const createReservations = async () => {
  const renters = await User.findAll({ where: { username: ['johnd', 'sarahlevi', 'davidc', 'miriama'] } });
  const parkings = await Parking.findAll();
  const timeSlots = await TimeSlot.findAll();

  const reservations = [];

  for (let i = 0; i < 10; i++) {
    const renter = faker.helpers.arrayElement(renters);
    const parking = faker.helpers.arrayElement(parkings);
    const timeSlot = faker.helpers.arrayElement(timeSlots);

    const startTime = new Date(`${timeSlot.date || '2025-06-23'}T${timeSlot.startTime}`);
    const endTime = new Date(`${timeSlot.date || '2025-06-23'}T${timeSlot.endTime}`);

    const totalPrice = timeSlot.price;

    reservations.push({
      renterId: renter.id,
      ownerId: parking.ownerId,
      parkingId: parking.id,
      timeSlotId: timeSlot.id,
      startTime,
      endTime,
      totalPrice
    });
  }

  await Reservation.bulkCreate(reservations);
};

const createMessages = async () => {
  const users = await User.findAll();
  const messages = [];

  for (let i = 0; i < 20; i++) {
    const sender = faker.helpers.arrayElement(users);
    let receiver = faker.helpers.arrayElement(users);
    while (receiver.id === sender.id) {
      receiver = faker.helpers.arrayElement(users);
    }

    messages.push({
      senderId: sender.id,
      receiverId: receiver.id,
      content: faker.lorem.sentence(),
      conversationId: faker.datatype.uuid()
    });
  }

  await Message.bulkCreate(messages);
};

const createReports = async () => {
  const users = await User.findAll();
  const parkings = await Parking.findAll();

  const reports = [];

  for (let i = 0; i < 10; i++) {
    const reporter = faker.helpers.arrayElement(users);
    let reportedUser = faker.helpers.arrayElement(users);
    while (reportedUser.id === reporter.id) {
      reportedUser = faker.helpers.arrayElement(users);
    }

    const parking = faker.helpers.arrayElement(parkings);

    reports.push({
      reporterId: reporter.id,
      reportedUserId: reportedUser.id,
      parkingId: parking.id,
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      description: faker.lorem.sentences(2)
    });
  }

  await Report.bulkCreate(reports);
};

const seed = async () => {
  try {
    await createUsers();
    await createParkings();
    await createTimeSlots();
    await createReservations();
    await createMessages();
    await createReports();
    await createResources();
    await createRolePermissions();
    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
};

seed();