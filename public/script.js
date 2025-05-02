// script.js
// Fetch and display students
async function fetchStudents() {
    try {
      const response = await fetch('mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
      const data = await response.json();
  
      if (!data.success) {
        console.error('Error fetching students:', data.message);
        Swal.fire('Error', data.message || 'Failed to fetch students', 'error');
        return;
      }
  
      const studentCards = document.getElementById('studentCards');
      studentCards.innerHTML = '';
  
      data.data.forEach((student) => {
        const academic = student.academicRecords?.[0] || {};
        const personal = student.personalDetails?.[0] || {};
        const attendance = student.attendance || {};
        const card = `
          <div class="student-card">
            <div class="student-card-header">
              <h3>${student.name || 'N/A'}</h3>
              <span>${student.email || 'N/A'}</span>
            </div>
            <div class="student-card-body">
              <p><strong>Roll Number:</strong> ${student.rollNumber || 'N/A'}</p>
              <p><strong>Course:</strong> ${academic.course || 'N/A'}</p>
              <p><strong>CGPA:</strong> ${academic.cgpa || 'N/A'}</p>
            </div>
            <div class="student-card-actions">
              <button class="btn btn-view" onclick="viewStudent('${student._id}')">View Details</button>
              <button class="btn btn-edit" onclick="openEditModal('${student._id}')">Edit</button>
              <button class="btn btn-delete" onclick="deleteStudent('${student._id}')">Delete</button>
            </div>
          </div>
        `;
        studentCards.innerHTML += card;
      });
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      Swal.fire('Error', 'Failed to fetch students: ' + error.message, 'error');
    }
  }
  
  // View individual student details
  async function viewStudent(studentId) {
    try {
      Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
  
      const response = await fetch(`http://localhost:3000/api/students/${studentId}`);
      const data = await response.json();
  
      Swal.close();
  
      if (!data.success) {
        Swal.fire('Error', data.message || 'Failed to fetch student data', 'error');
        return;
      }
  
      const student = data.data;
      const personal = student.personalDetails?.[0] || {};
      const academic = student.academicRecords?.[0] || {};
      const attendance = student.attendance || {};
  
      const dateOfBirth = personal.dateOfBirth
        ? new Date(personal.dateOfBirth).toLocaleDateString()
        : 'Not provided';
      const attendancePercentage = attendance.totalDays > 0
        ? ((attendance.daysPresent / attendance.totalDays) * 100).toFixed(2) + '%'
        : 'N/A';
  
      await Swal.fire({
        title: `${student.name || 'Student'}'s Profile`,
        html: `
          <div class="student-details">
            <h3>Personal Details</h3>
            <p><strong>Name:</strong> ${student.name || 'Not provided'}</p>
            <p><strong>Email:</strong> ${student.email || 'Not provided'}</p>
            <p><strong>Roll Number:</strong> ${student.rollNumber || 'Not provided'}</p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
            <p><strong>Address:</strong> ${personal.address || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${personal.phone || 'Not provided'}</p>
            <h3>Academic Details</h3>
            <p><strong>Course:</strong> ${academic.course || 'Not provided'}</p>
            <p><strong>Branch:</strong> ${academic.branch || 'Not provided'}</p>
            <p><strong>Semester:</strong> ${academic.semester || 'Not provided'}</p>
            <p><strong>CGPA:</strong> ${academic.cgpa || 'Not provided'}</p>
            <h3>Attendance</h3>
            <p><strong>Total Days:</strong> ${attendance.totalDays || 'Not provided'}</p>
            <p><strong>Days Present:</strong> ${attendance.daysPresent || 'Not provided'}</p>
            <p><strong>Attendance Percentage:</strong> ${attendancePercentage}</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        customClass: {
          popup: 'student-details-modal'
        }
      });
    } catch (error) {
      console.error('❌ Error viewing student:', error);
      Swal.fire('Error', 'Failed to fetch student data: ' + error.message, 'error');
    }
  }
  
  // Add a new student
  document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const studentData = {
      name: formData.get('name'),
      email: formData.get('email'),
      rollNumber: formData.get('rollNumber'),
      dateOfBirth: formData.get('dateOfBirth'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      course: formData.get('course'),
      branch: formData.get('branch'),
      semester: formData.get('semester'),
      cgpa: formData.get('cgpa'),
      totalDays: formData.get('totalDays'),
      daysPresent: formData.get('daysPresent')
    };
  
    try {
      const response = await fetch('mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
  
      const data = await response.json();
  
      if (data.success) {
        Swal.fire('Success', 'Student added successfully!', 'success');
        e.target.reset();
        fetchStudents();
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error('❌ Error adding student:', error);
      Swal.fire('Error', 'Failed to add student: ' + error.message, 'error');
    }
  });
  
  // Open edit modal
  async function openEditModal(studentId) {
    try {
      Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
  
      const response = await fetch(`mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${studentId}`);
      const data = await response.json();
  
      Swal.close();
  
      if (!data.success) {
        Swal.fire('Error', data.message || 'Failed to fetch student data', 'error');
        return;
      }
  
      const student = data.data;
      const personalDetails = student.personalDetails?.[0] || {};
      const academicRecords = student.academicRecords?.[0] || {};
      const attendance = student.attendance || {};
  
      const { value: formValues } = await Swal.fire({
        title: 'Edit Student Profile',
        html: `
          <form class="edit-form">
            <h4>Personal Details</h4>
            <div class="form-group">
              <label class="required" for="swal-name"><i class="fas fa-user"></i> Name</label>
              <input id="swal-name" class="swal2-input" placeholder="Enter name" value="${student.name || ''}" required>
            </div>
            <div class="form-group">
              <label class="required" for="swal-email"><i class="fas fa-envelope"></i> Email</label>
              <input id="swal-email" class="swal2-input" type="email" placeholder="Enter email" value="${student.email || ''}" required>
            </div>
            <div class="form-group">
              <label class="required" for="swal-rollNumber"><i class="fas fa-id-card"></i> Roll Number</label>
              <input id="swal-rollNumber" class="swal2-input" placeholder="Enter roll number" value="${student.rollNumber || ''}" required>
            </div>
            <div class="form-group">
              <label for="swal-dateOfBirth"><i class="fas fa-calendar-alt"></i> Date of Birth</label>
              <input id="swal-dateOfBirth" class="swal2-input" type="date" value="${personalDetails.dateOfBirth ? new Date(personalDetails.dateOfBirth).toISOString().split('T')[0] : ''}">
            </div>
            <div class="form-group">
              <label for="swal-address"><i class="fas fa-map-marker-alt"></i> Address</label>
              <input id="swal-address" class="swal2-input" placeholder="Enter address" value="${personalDetails.address || ''}">
            </div>
            <div class="form-group">
              <label for="swal-phone"><i class="fas fa-phone"></i> Phone</label>
              <input id="swal-phone" class="swal2-input" placeholder="Enter phone number" value="${personalDetails.phone || ''}">
            </div>
            <h4>Academic Record</h4>
            <div class="form-group">
              <label class="required tooltip" data-tooltip="e.g., B.Tech, MCA" for="swal-course"><i class="fas fa-book"></i> Course</label>
              <input id="swal-course" class="swal2-input" placeholder="Enter course" value="${academicRecords.course || ''}" required>
            </div>
            <div class="form-group">
              <label class="required tooltip" data-tooltip="e.g., CSE, ECE" for="swal-branch"><i class="fas fa-code-branch"></i> Branch</label>
              <input id="swal-branch" class="swal2-input" placeholder="Enter branch" value="${academicRecords.branch || ''}" required>
            </div>
            <div class="form-group">
              <label class="required tooltip" data-tooltip="1 to 8" for="swal-semester"><i class="fas fa-graduation-cap"></i> Semester</label>
              <input id="swal-semester" class="swal2-input" type="number" min="1" max="8" placeholder="Enter semester" value="${academicRecords.semester || ''}" required>
            </div>
            <div class="form-group">
              <label class="required tooltip" data-tooltip="0 to 10" for="swal-cgpa"><i class="fas fa-chart-bar"></i> CGPA</label>
              <input id="swal-cgpa" class="swal2-input" type="number" min="0" max="10" step="0.01" placeholder="Enter CGPA" value="${academicRecords.cgpa || ''}" required>
            </div>
            <h4>Attendance</h4>
            <div class="form-group">
              <label for="swal-totalDays"><i class="fas fa-calendar-check"></i> Total Days</label>
              <input id="swal-totalDays" class="swal2-input" type="number" min="0" placeholder="Enter total days" value="${attendance.totalDays || ''}">
            </div>
            <div class="form-group">
              <label for="swal-daysPresent"><i class="fas fa-check-circle"></i> Days Present</label>
              <input id="swal-daysPresent" class="swal2-input" type="number" min="0" placeholder="Enter days present" value="${attendance.daysPresent || ''}">
            </div>
          </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        customClass: {
          popup: 'edit-student-modal'
        },
        preConfirm: () => {
          try {
            const name = document.getElementById('swal-name').value.trim();
            const email = document.getElementById('swal-email').value.trim();
            const rollNumber = document.getElementById('swal-rollNumber').value.trim();
            const dateOfBirth = document.getElementById('swal-dateOfBirth').value;
            const address = document.getElementById('swal-address').value.trim();
            const phone = document.getElementById('swal-phone').value.trim();
            const course = document.getElementById('swal-course').value.trim();
            const branch = document.getElementById('swal-branch').value.trim();
            const semester = parseInt(document.getElementById('swal-semester').value);
            const cgpa = parseFloat(document.getElementById('swal-cgpa').value);
            const totalDays = parseInt(document.getElementById('swal-totalDays').value) || undefined;
            const daysPresent = parseInt(document.getElementById('swal-daysPresent').value) || undefined;
  
            if (!name) {
              Swal.showValidationMessage('Name is required');
              return false;
            }
            if (!email) {
              Swal.showValidationMessage('Email is required');
              return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              Swal.showValidationMessage('Please enter a valid email address');
              return false;
            }
            if (!rollNumber) {
              Swal.showValidationMessage('Roll Number is required');
              return false;
            }
            if (!course) {
              Swal.showValidationMessage('Course is required');
              return false;
            }
            if (!branch) {
              Swal.showValidationMessage('Branch is required');
              return false;
            }
            if (!semester || semester < 1 || semester > 8) {
              Swal.showValidationMessage('Semester must be between 1 and 8');
              return false;
            }
            if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
              Swal.showValidationMessage('CGPA must be between 0 and 10');
              return false;
            }
            if (totalDays !== undefined && totalDays < 0) {
              Swal.showValidationMessage('Total Days cannot be negative');
              return false;
            }
            if (daysPresent !== undefined && daysPresent < 0) {
              Swal.showValidationMessage('Days Present cannot be negative');
              return false;
            }
            if (totalDays !== undefined && daysPresent !== undefined && daysPresent > totalDays) {
              Swal.showValidationMessage('Days Present cannot exceed Total Days');
              return false;
            }
  
            return {
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
            };
          } catch (error) {
            console.error('Validation error:', error);
            Swal.showValidationMessage('An error occurred during validation');
            return false;
          }
        }
      });
  
      if (formValues) {
        Swal.fire({
          title: 'Updating...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
  
        try {
          const updateResponse = await fetch(`mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formValues)
          });
  
          const updateResult = await updateResponse.json();
  
          if (updateResult.success) {
            Swal.fire('Success', 'Student updated successfully!', 'success');
            fetchStudents();
          } else {
            Swal.fire('Error', updateResult.message, 'error');
          }
        } catch (error) {
          console.error('Update error:', error);
          Swal.fire('Error', 'Failed to update student: ' + error.message, 'error');
        }
      }
    } catch (error) {
      console.error('❌ Error editing student:', error);
      Swal.fire('Error', 'Failed to fetch student data: ' + error.message, 'error');
    }
  }
  
  // Delete student
  async function deleteStudent(studentId) {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`mongodb+srv://<nikhil9889>:<988986>@cluster0.4tpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0${studentId}`, {
          method: 'DELETE'
        });
  
        const data = await response.json();
  
        if (data.success) {
          Swal.fire('Deleted!', 'Student has been deleted.', 'success');
          fetchStudents();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('❌ Error deleting student:', error);
        Swal.fire('Error', 'Failed to delete student: ' + error.message, 'error');
      }
    }
  }
  
  // Initial load
  document.addEventListener('DOMContentLoaded', fetchStudents);
