const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("../utils/errorHandler");

const authRoutes = require("../routes/auth.routes");
const usersRoutes = require("../routes/users.routes");

const app = express();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

module.exports = app;
