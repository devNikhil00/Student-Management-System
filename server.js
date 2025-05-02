const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/student');

const app = express();
const PORT = 3000;

// ======================
// Middleware Setup
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// ======================
// MongoDB Connection
// ======================
mongoose.connect('mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ======================
// Routes
// ======================

// CREATE Student
app.post('/api/students', async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      dateOfBirth,
      address,
      phone,
      course,
      branch,
      semester,
      cgpa,
      totalDays,
      daysPresent
    } = req.body;

    // Log incoming data for debugging
    console.log('Incoming request body:', req.body);

    // Validate required fields
    if (!name || !email || !rollNumber || !course || !branch || !semester || !cgpa) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Roll Number, Course, Branch, Semester, and CGPA are required!'
      });
    }

    // Validate numeric fields
    if (isNaN(semester) || semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be a number between 1 and 8'
      });
    }
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        success: false,
        message: 'CGPA must be a number between 0 and 10'
      });
    }
    if ((totalDays !== undefined && (isNaN(totalDays) || totalDays < 0)) || 
        (daysPresent !== undefined && (isNaN(daysPresent) || daysPresent < 0))) {
      return res.status(400).json({
        success: false,
        message: 'Total Days and Days Present must be non-negative numbers'
      });
    }
    if (totalDays !== undefined && daysPresent !== undefined && daysPresent > totalDays) {
      return res.status(400).json({
        success: false,
        message: 'Days Present cannot exceed Total Days'
      });
    }

    // Create new student instance
    const newStudent = new Student({
      name,
      email,
      rollNumber,
      personalDetails: dateOfBirth || address || phone ? [{
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address: address || undefined,
        phone: phone || undefined
      }] : [],
      academicRecords: [{
        course,
        branch,
        semester: Number(semester),
        cgpa: Number(cgpa)
      }],
      attendance: totalDays !== undefined || daysPresent !== undefined ? {
        totalDays: totalDays ? Number(totalDays) : 0,
        daysPresent: daysPresent ? Number(daysPresent) : 0
      } : undefined
    });

    // Log the data to be saved for debugging
    console.log('Data to save:', newStudent);

    // Save to MongoDB
    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      data: savedStudent
    });
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Roll Number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

// GET All Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().lean();

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

// GET Single Student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findById(req.params.id).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('❌ Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
});

// UPDATE Student
app.put('/api/students/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const {
      name,
      email,
      rollNumber,
      dateOfBirth,
      address,
      phone,
      course,
      branch,
      semester,
      cgpa,
      totalDays,
      daysPresent
    } = req.body;

    // Validate required fields
    if (!name || !email || !rollNumber || !course || !branch || !semester || !cgpa) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Roll Number, Course, Branch, Semester, and CGPA are required!'
      });
    }

    // Validate numeric fields
    if (isNaN(semester) || semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be a number between 1 and 8'
      });
    }
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        success: false,
        message: 'CGPA must be a number between 0 and 10'
      });
    }
    if ((totalDays !== undefined && (isNaN(totalDays) || totalDays < 0)) || 
        (daysPresent !== undefined && (isNaN(daysPresent) || daysPresent < 0))) {
      return res.status(400).json({
        success: false,
        message: 'Total Days and Days Present must be non-negative numbers'
      });
    }
    if (totalDays !== undefined && daysPresent !== undefined && daysPresent > totalDays) {
      return res.status(400).json({
        success: false,
        message: 'Days Present cannot exceed Total Days'
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        rollNumber,
        personalDetails: dateOfBirth || address || phone ? [{
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          address: address || undefined,
          phone: phone || undefined
        }] : [],
        academicRecords: [{
          course,
          branch,
          semester: Number(semester),
          cgpa: Number(cgpa)
        }],
        attendance: totalDays !== undefined || daysPresent !== undefined ? {
          totalDays: totalDays || 0,
          daysPresent: daysPresent || 0
        } : undefined
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Roll Number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
});

// DELETE Student
app.delete('/api/students/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
});

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
