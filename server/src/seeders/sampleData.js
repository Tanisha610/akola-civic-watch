require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Issue.deleteMany({}), Comment.deleteMany({})]);

  const users = await User.insertMany([
    { name: 'Admin Officer', email: 'admin@akola.gov.in', password: 'adminpass', phone: '0000000000', role: 'admin' },
    { name: 'Aman Patil', email: 'aman@example.com', password: 'password123', phone: '9999999991', role: 'citizen' },
    { name: 'Riya Deshmukh', email: 'riya@example.com', password: 'password123', phone: '9999999992', role: 'citizen' }
  ]);

  const [admin, aman, riya] = users;

  const issues = await Issue.insertMany([
    {
      title: 'Water supply disruption near Shivaji Nagar',
      description: 'Residents are facing low pressure and intermittent supply since last week.',
      category: 'Water Supply',
      image: '',
      latitude: 20.7185,
      longitude: 77.0048,
      ward: 'Ward 7',
      status: 'Under Review',
      votes: 48,
      createdBy: aman._id
    },
    {
      title: 'Large potholes near Malkapur road',
      description: 'Road surface has degraded and creates daily accidents during rain.',
      category: 'Roads & Potholes',
      image: '',
      latitude: 20.7104,
      longitude: 77.0091,
      ward: 'Ward 12',
      status: 'In Progress',
      votes: 91,
      createdBy: riya._id
    },
    {
      title: 'Garbage dumping beside market lane',
      description: 'Unauthorized dumping is causing foul smell and health concerns.',
      category: 'Waste Management',
      image: '',
      latitude: 20.7212,
      longitude: 77.0153,
      ward: 'Ward 3',
      status: 'Reported',
      votes: 67,
      createdBy: aman._id
    }
  ]);

  await Comment.insertMany([
    { issueId: issues[0]._id, userId: admin._id, text: 'Field team assigned for inspection.' },
    { issueId: issues[1]._id, userId: admin._id, text: 'Repair work approved by engineering department.' }
  ]);

  console.log('Sample data seeded successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
