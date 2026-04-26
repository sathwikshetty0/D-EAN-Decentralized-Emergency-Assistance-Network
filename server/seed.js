const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Alert = require('./src/models/Alert');
const Log = require('./src/models/Log');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dean');

const seedData = async () => {
  try {
    await User.deleteMany();
    await Alert.deleteMany();
    await Log.deleteMany();

    console.log('Cleared existing data.');

    // Users
    const users = await User.insertMany([
      { name: 'Arjun Kumar', email: 'arjun@dean.com', password: 'user123', role: 'user', totalAlertsSent: 2 },
      { name: 'Priya Nair', email: 'priya@dean.com', password: 'user123', role: 'user', totalAlertsSent: 2 },
      { name: 'Rohit M.', email: 'rohit@dean.com', password: 'user123', role: 'user', totalAlertsSent: 1 }
    ]);

    // Responders
    const responders = await User.insertMany([
      { name: 'Riya Sharma', email: 'riya@dean.com', password: 'resp123', role: 'responder', skills: ['First Aid', 'CPR'], zone: 'Mangaluru Central', isAvailable: true, totalAlertsResponded: 15 },
      { name: 'Kiran Shetty', email: 'kiran@dean.com', password: 'resp123', role: 'responder', skills: ['Fire Safety', 'Flood Response'], zone: 'Kadri', isAvailable: true, totalAlertsResponded: 10 },
      { name: 'Ananya Rao', email: 'ananya@dean.com', password: 'resp123', role: 'responder', skills: ['Trauma Support', 'First Aid'], zone: 'Kodialbail', isAvailable: false, totalAlertsResponded: 5 }
    ]);

    // Admin
    const admin = await User.create({
      name: 'Admin User', email: 'admin@dean.com', password: 'admin123', role: 'admin'
    });

    // Sample Alerts
    await Alert.insertMany([
      {
        alertId: 'DEAN-0001',
        triggeredBy: users[0]._id, // Arjun
        emergencyType: 'medical',
        location: { lat: 12.8703, lng: 74.8436, address: 'Kodialbail' },
        status: 'resolved',
        routingMode: 'cloud',
        assignedResponder: responders[0]._id, // Riya
        timestamps: { created: new Date(Date.now() - 86400000), resolved: new Date(Date.now() - 80000000) }
      },
      {
        alertId: 'DEAN-0002',
        triggeredBy: users[1]._id, // Priya
        emergencyType: 'fire',
        location: { lat: 12.8805, lng: 74.8569, address: 'Kadri' },
        status: 'resolved',
        routingMode: 'cloud',
        assignedResponder: responders[1]._id, // Kiran
        timestamps: { created: new Date(Date.now() - 40000000), resolved: new Date(Date.now() - 36000000) }
      },
      {
        alertId: 'DEAN-0003',
        triggeredBy: users[2]._id, // Rohit
        emergencyType: 'accident',
        location: { lat: 12.8665, lng: 74.8426, address: 'Mangaluru' },
        status: 'resolved',
        routingMode: 'p2p',
        assignedResponder: responders[0]._id, // Riya
        timestamps: { created: new Date(Date.now() - 10000000), resolved: new Date(Date.now() - 5000000) }
      },
      {
        alertId: 'DEAN-0004',
        triggeredBy: users[0]._id, // Arjun
        emergencyType: 'flood',
        location: { lat: 12.8805, lng: 74.8569, address: 'Kadri' },
        status: 'accepted',
        routingMode: 'cloud',
        assignedResponder: responders[1]._id, // Kiran
        timestamps: { created: new Date(Date.now() - 2000000), accepted: new Date(Date.now() - 1500000) }
      },
      {
        alertId: 'DEAN-0005',
        triggeredBy: users[1]._id, // Priya
        emergencyType: 'medical',
        location: { lat: 12.8703, lng: 74.8436, address: 'Kodialbail' },
        status: 'pending',
        routingMode: 'cloud',
        timestamps: { created: new Date(Date.now() - 300000) }
      }
    ]);

    console.log('Seed data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
