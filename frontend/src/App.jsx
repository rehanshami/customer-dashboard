import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    axios.get('https://customer-dashboard-yw8d.onrender.com/api/customers')
      .then(res => {
        setCustomers(res.data);
        setFilteredCustomers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const customersByLocation = filteredCustomers.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(customersByLocation).map(location => ({
    name: location,
    value: customersByLocation[location],
  }));

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);

    if (selected === 'All') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(customers.filter(c => c.location === selected));
    }
  };

  const sortData = (order) => {
    const sorted = [...filteredCustomers].sort((a, b) =>
      order === 'asc' ? a.total_spent - b.total_spent : b.total_spent - a.total_spent
    );
    setSortOrder(order);
    setFilteredCustomers(sorted);
  };

  const locations = [...new Set(customers.map(c => c.location))];

  if (customers.length === 0) return <div className="p-6 text-center text-gray-600">Loading customer insights...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Customer Insights Dashboard</h1>
        <p className="text-gray-600 text-sm">Visualize customer distribution and spending by location.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="location-filter" className="text-gray-700 font-medium">Filter by Location:</label>
          <select
            id="location-filter"
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="flex gap-2">
          <button
            onClick={() => sortData('asc')}
            className={`flex items-center gap-1 px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition ${
              sortOrder === 'asc' ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <ArrowUp size={16} /> Asc
          </button>
          <button
            onClick={() => sortData('desc')}
            className={`flex items-center gap-1 px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition ${
              sortOrder === 'desc' ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <ArrowDown size={16} /> Desc
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <section className="mb-12 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 Total Spent per Customer</h2>
        {filteredCustomers.length === 0 ? (
          <p className="text-gray-500 text-sm">No data available for selected filter.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredCustomers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_spent" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Pie Chart */}
      <section className="mb-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📍 Customers by Location</h2>
        {pieData.length === 0 ? (
          <p className="text-gray-500 text-sm">No location data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
