const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 5 },
    grade: String,
    email: { type: String, unique: true }
});

module.exports = mongoose.model('Student', studentSchema);