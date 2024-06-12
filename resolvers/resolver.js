const jwt = require('jsonwebtoken');
const User = require('../models/users');

const resolvers = {
  Mutation: {
    signup: async (_, { email, password }) => {
      try {
        console.log('Signup mutation called with email:', email);
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log('User with email', email, 'already exists');
          throw new Error('User with this email already exists');
        }
        
        console.log('Creating a new user with email:', email);
        const newUser = new User({ email, password });
        await newUser.save();
        console.log('New user saved:', newUser);

        const token = jwt.sign({ userId: newUser.id }, 'your_secret_key', { expiresIn: '1d' });
        console.log('JWT token generated for user:', newUser.id);
        return token;
      } catch (error) {
        console.error('Signup failed:', error.message);
        throw new Error('Signup failed: ' + error.message);
      }
    },
    login: async (_, { email, password }) => {
      try {
        console.log('Login mutation called with email:', email);
        
        const user = await User.findOne({ email });
        if (!user) {
          console.log('User with email', email, 'not found');
          throw new Error('Invalid email or password');
        }
        
        console.log('User found:', user);

        if (user.password !== password) {
          console.log('Invalid password for user:', user.id);
          throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1d' });
        console.log('JWT token generated for user:', user.id);
        return token;
      } catch (error) {
        console.error('Login failed:', error.message);
        throw new Error('Login failed: ' + error.message);
      }
    },
  },
};

module.exports = resolvers;
