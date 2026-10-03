const { User, AuditLog } = require('../models');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../middlewares/errorMiddleware');

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  // Audit log for login
  await AuditLog.create({
    userId: user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    details: { email: user.email }
  }).catch(() => {}); // non-blocking

  return {
    user: user.toJSON(),
    token
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user.toJSON();
};

module.exports = {
  login,
  getCurrentUser
};
