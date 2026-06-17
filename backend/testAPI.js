import axios from 'axios';

const testAPI = async () => {
  try {
    const { data: users } = await axios.get('http://localhost:5000/api/auth/users');
    const staffUser = users[0];

    console.log('Adding salary...');
    const res = await axios.post('http://localhost:5000/api/hr/salaries', {
      user_id: staffUser._id,
      amount: 3500,
      month: 'October 2023',
      status: 'pending',
      payment_date: new Date()
    });
    console.log('Add salary response:', res.status);
    
    console.log('Updating salary...');
    const putRes = await axios.put(`http://localhost:5000/api/hr/salaries/${res.data._id}`, { status: 'paid' });
    console.log('Update salary response:', putRes.status);
    
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
};

testAPI();
