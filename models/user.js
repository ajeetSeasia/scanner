// models/User.js
const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    system_username: { type: String, required: true, unique: true },
    role: { type: String, default: 'user', enum: ['admin', 'user']},
    password: { type: String, required: true },
    IP: { type: String, required: true },
    operating_system: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    employee_id: { type: Number, required: true, unique: true },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('User', userSchema);
