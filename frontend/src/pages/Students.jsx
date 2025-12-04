import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    case_id: '',
    full_name: '',
    year_of_study: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await api.getStudents();
      // Handle both array response and object with students property
      const studentsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.students || []);
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading students:', error);
      // If it's a network error, try again after a short delay
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network')) {
        console.log('Backend not ready, retrying in 1 second...');
        setTimeout(() => {
          loadStudents();
        }, 1000);
      } else {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addStudent(formData);
      setFormData({ case_id: '', full_name: '', year_of_study: '' });
      setShowForm(false);
      loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add student. Check console for details.';
      alert(errorMessage);
      // Still refresh the list in case the student already existed
      loadStudents();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm(`Are you sure you want to delete student ${caseId}? This will also delete all their flight and train bookings.`)) {
      return;
    }

    try {
      await api.deleteStudent(caseId);
      loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete student.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading students...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Registered Students</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-colors font-medium"
        >
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border-2 border-black p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">New Student Registration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Case ID</label>
              <input
                type="text"
                name="case_id"
                value={formData.case_id}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., ABC123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year of Study</label>
              <input
                type="text"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Freshman, Sophomore, Junior, Senior"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 border-2 border-black px-6 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium"
          >
            Register Student
          </button>
        </form>
      )}

      <div className="border-2 border-black">
        <div className="grid grid-cols-5 gap-4 p-4 border-b-2 border-black font-bold bg-black text-white">
          <div>Case ID</div>
          <div>Full Name</div>
          <div>Year of Study</div>
          <div>Group ID</div>
          <div>Actions</div>
        </div>
        {students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No students registered yet. Add one to get started!
          </div>
        ) : (
          students.map((student, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 gap-4 p-4 border-b border-gray-300 hover:bg-gray-50"
            >
              <div className="font-medium">{student.case_id}</div>
              <div>{student.full_name}</div>
              <div>{student.year_of_study}</div>
              <div className="text-sm">{student.group_id || 'None'}</div>
              <div>
                <button
                  onClick={() => handleDelete(student.case_id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Total Students: {students.length}
      </div>
    </div>
  );
}

export default Students;
