const connection = require('../config/connection');
// const { User, Thought } = require('../models');
const { User } = require('../models');
const { getRandomName } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

//   await Thought.deleteMany({});

  // Drop existing susers
  await User.deleteMany({});

  // Create empty array to hold the students
  const users = [];

  // Loop 20 times -- add students to the students array
  for (let i = 0; i < 11; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    // const thoughts = getRandomThoughts(10);

    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    // const last = fullName.split(' ')[1];
    const username = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;
    const email = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}@hotmail.com`;

    users.push({
    //   first,
    //   last,
      username,
      email,
    //   thoughts
    });
  }

  // Add students to the collection and await the results
  await User.collection.insertMany(users);

//   await Thought.collection.insertOne({
//     thought: 'thought note',
//     inPerson: false,
//     users: [...users],
//   });

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
