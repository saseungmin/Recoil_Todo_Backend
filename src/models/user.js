import mongoose, { Schema } from 'mongoose';

import bcrypt from 'bcrypt';

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

UserSchema.statics.findByUserId = function (id) {
  return this.findOne({ id });
};

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);

  this.hashedPassword = hash;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();

  delete data.hashedPassword;
  return data;
};

const User = mongoose.model('User', UserSchema);

export default User;
