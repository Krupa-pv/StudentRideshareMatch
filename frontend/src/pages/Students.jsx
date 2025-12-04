import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    case_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.getStudents();
      setStudents(response.data.students || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading students:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addStudent(formData);
      setFormData({ case_id: '', first_name: '', last_name: '', email: '', phone: '' });
      setShowForm(false);
      loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Check console for details.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="student@case.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="123-456-7890"
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
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Phone</div>
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
              <div>{student.first_name}</div>
              <div>{student.last_name}</div>
              <div className="text-sm">{student.email}</div>
              <div className="text-sm">{student.phone}</div>
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
