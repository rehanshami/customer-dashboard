import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);
  console.log(customers);

  const customersByLocation = customers.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(customersByLocation).map(location => ({
    name: location,
    value: customersByLocation[location],
  }));
  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Customer Insights</h1>
      {/* Bar Chart: Total Spent per Customer */}
<h2 className="text-xl font-semibold mt-6 mb-4">Total Spent per Customer</h2>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={customers}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="total_spent" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
      {/* We'll add charts here next */}

      {/* Pie Chart: Customers by Location */}
<h2 className="text-xl font-semibold mt-6 mb-2">Customers by Location</h2>
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      labelLine={false}
      outerRadius={100}
      fill="#8884d8"
      dataKey="value"
      label
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Legend />
  </PieChart>
</ResponsiveContainer>
    </div>
  );
}

export default Dashboard;