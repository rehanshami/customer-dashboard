import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8000/api/customers')
      .then(res => {
        setCustomers(res.data);
        setFilteredCustomers(res.data); // Initialize filtered customers with all customers
      })
      .catch(err => console.error(err));
  }, []);

  console.log(customers);

  const customersByLocation = filteredCustomers.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(customersByLocation).map(location => ({
    name: location,
    value: customersByLocation[location],
  }));

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'All') {
      setFilteredCustomers(customers); // No filter, show all
    } else {
      const filtered = customers.filter(customer => customer.location === selectedFilter);
      setFilteredCustomers(filtered); // Apply filter
    }
  };

  const locations = [...new Set(customers.map(customer => customer.location))];

  // Show loading state if customers are not yet loaded
  if (customers.length === 0) {
    return <div>Loading...</div>;
  }

  const sortData = (order) => {
    const sorted = [...filteredCustomers].sort((a, b) => {
      if (order === 'asc') {
        return a.total_spent - b.total_spent;
      } else {
        return b.total_spent - a.total_spent;
      }
    });
    setFilteredCustomers(sorted);
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Customer Insights</h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex items-center">
        <label className="text-lg font-medium mr-4">Filter by Location: </label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

          {/* Sort Buttons */}
    <div className="mb-6">
      <button onClick={() => sortData('asc')} className="px-4 py-2 mr-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700/90">Sort Ascending</button>
      <button onClick={() => sortData('desc')} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700/90">Sort Descending</button>
    </div>

      {/* Bar Chart: Total Spent per Customer */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Total Spent per Customer</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredCustomers}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_spent" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

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