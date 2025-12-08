import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
  // Students
  getStudents: () => axios.get(`${API_BASE_URL}/students`),
  addStudent: (data) => axios.post(`${API_BASE_URL}/students`, data),
  deleteStudent: (caseId) => axios.delete(`${API_BASE_URL}/students/${caseId}`),

  // Flights
  getFlights: () => axios.get(`${API_BASE_URL}/flights`),
  addFlight: (data) => axios.post(`${API_BASE_URL}/flights`, data),

  // Trains
  getTrains: () => axios.get(`${API_BASE_URL}/trains`),
  addTrain: (data) => axios.post(`${API_BASE_URL}/trains`, data),

  // Bookings
  bookFlight: (data) => axios.post(`${API_BASE_URL}/bookings/flight`, data),
  bookTrain: (data) => axios.post(`${API_BASE_URL}/bookings/train`, data),
  getStudentBookings: (caseId) => axios.get(`${API_BASE_URL}/bookings/student/${caseId}`),

  // Matches - THE CORE FEATURE
  findFlightMatches: (data) => axios.post(`${API_BASE_URL}/matches/flights`, data),
  findTrainMatches: (data) => axios.post(`${API_BASE_URL}/matches/trains`, data),
  findGroupMatches: (groupId) => axios.get(`${API_BASE_URL}/matches/group/${groupId}`),

  // Groups
  getGroups: () => axios.get(`${API_BASE_URL}/groups`),
  createGroup: (data) => axios.post(`${API_BASE_URL}/groups`, data),
  getGroupMembers: (groupId) => axios.get(`${API_BASE_URL}/groups/${groupId}/members`),
  joinGroup: (data) => axios.post(`${API_BASE_URL}/groups/join`, data),
  leaveGroup: (data) => axios.post(`${API_BASE_URL}/groups/leave`, data),
  getStudentGroup: (caseId) => axios.get(`${API_BASE_URL}/groups/student/${caseId}`),
};
