const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/schoolDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// --- CRUD Routes with proper status codes ---

// CREATE student
app.post('/students', async (req, res, next) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        next(err); // Pass error to middleware
    }
});

// READ all students
app.get('/students', async (req, res, next) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        next(err);
    }
});

// READ single student
app.get('/students/:id', async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (err) {
        next(err);
    }
});

// UPDATE student
app.put('/students/:id', async (req, res, next) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (err) {
        next(err);
    }
});

// DELETE student
app.delete('/students/:id', async (req, res, next) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// Invalid route handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware (last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});