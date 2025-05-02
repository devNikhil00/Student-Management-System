const mongoose = require('mongoose');

// Sub-schema for personalDetails
const personalDetailsSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date
  },
  address: {
    type: String
  },
  phone: {
    type: String
  }
}, { _id: false });

// Sub-schema for academicRecords (updated to include subject)
const academicRecordSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
});

// Sub-schema for attendance
const attendanceSchema = new mongoose.Schema({
  totalDays: {
    type: Number,
    min: 0
  },
  daysPresent: {
    type: Number,
    min: 0
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
  personalDetails: [personalDetailsSchema],
  academicRecords: [academicRecordSchema],
  attendance: attendanceSchema
}, { timestamps: true }); // Added timestamps for createdAt/updatedAt

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;