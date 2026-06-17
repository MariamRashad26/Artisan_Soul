import axios from '../utils/axiosInstance';

// Shifts
export const getShifts = async () => {
  const { data } = await axios.get('/api/hr/shifts');
  return data;
};

export const getShift = async (id) => {
  const { data } = await axios.get(`/api/hr/shifts/${id}`);
  return data;
};

export const createShift = async (shiftData) => {
  const { data } = await axios.post('/api/hr/shifts', shiftData);
  return data;
};

export const updateShift = async (id, shiftData) => {
  const { data } = await axios.put(`/api/hr/shifts/${id}`, shiftData);
  return data;
};

export const deleteShift = async (id) => {
  const { data } = await axios.delete(`/api/hr/shifts/${id}`);
  return data;
};

// Salaries
export const getSalaries = async () => {
  const { data } = await axios.get('/api/hr/salaries');
  return data;
};

export const getSalary = async (id) => {
  const { data } = await axios.get(`/api/hr/salaries/${id}`);
  return data;
};

export const createSalary = async (salaryData) => {
  const { data } = await axios.post('/api/hr/salaries', salaryData);
  return data;
};

export const updateSalary = async (id, salaryData) => {
  const { data } = await axios.put(`/api/hr/salaries/${id}`, salaryData);
  return data;
};

export const deleteSalary = async (id) => {
  const { data } = await axios.delete(`/api/hr/salaries/${id}`);
  return data;
};

// Attendance
export const getAttendance = async () => {
  const { data } = await axios.get('/api/hr/attendance');
  return data;
};

export const getAttendanceById = async (id) => {
  const { data } = await axios.get(`/api/hr/attendance/${id}`);
  return data;
};

export const createAttendance = async (attendanceData) => {
  const { data } = await axios.post('/api/hr/attendance', attendanceData);
  return data;
};

export const updateAttendance = async (id, attendanceData) => {
  const { data } = await axios.put(`/api/hr/attendance/${id}`, attendanceData);
  return data;
};

export const deleteAttendance = async (id) => {
  const { data } = await axios.delete(`/api/hr/attendance/${id}`);
  return data;
};
