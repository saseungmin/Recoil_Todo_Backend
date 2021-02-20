import mongoose, { Schema } from 'mongoose';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);

  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);

  return result;
};

UserSchema.statics.findByUserId = function (id) {
  return this.findOne({ id });
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();

  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      id: this.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5d',
    },
  );

  return token;
};

const User = mongoose.model('User', UserSchema);

export default User;
