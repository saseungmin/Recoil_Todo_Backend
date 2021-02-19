/* eslint-disable no-console */
import mongoose from 'mongoose';

export function callback(err) {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to MongoDB');
  }
}

export function connectDatabase(mongoUrl) {
  return mongoose.connect(
    mongoUrl,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    callback,
  );
}
