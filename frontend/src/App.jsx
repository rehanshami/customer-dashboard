import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async (retries = 3) => {
      try {
        const res = await axios.get('https://customer-dashboard-yw8d.onrender.com/api/customers');
        setCustomers(res.data);
        setFilteredCustomers(res.data);
        setLoading(false);
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchCustomers(retries - 1), 3000);
        } else {
          console.error("Failed to fetch customer data:", err);
          setLoading(false);
        }
      }
    };
    fetchCustomers();
  }, []);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);
    setFilteredCustomers(selected === 'All' ? customers : customers.filter(c => c.location === selected));
  };

  const sortData = (order) => {
    const sorted = [...filteredCustomers].sort((a, b) =>
      order === 'asc' ? a.total_spent - b.total_spent : b.total_spent - a.total_spent
    );
    setSortOrder(order);
    setFilteredCustomers(sorted);
  };

  const customersByLocation = filteredCustomers.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});

  const ageDistribution = filteredCustomers.reduce((acc, curr) => {
    const ageGroup = `${Math.floor(curr.age / 10) * 10}s`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});

  const spendingQuartiles = filteredCustomers.map(c => c.total_spent).sort((a, b) => a - b);
  const quartileData = [
    { name: "Lowest 25%", value: spendingQuartiles[Math.floor(spendingQuartiles.length * 0.25)] },
    { name: "Median", value: spendingQuartiles[Math.floor(spendingQuartiles.length * 0.5)] },
    { name: "Top 25%", value: spendingQuartiles[Math.floor(spendingQuartiles.length * 0.75)] }
  ];

  const locations = [...new Set(customers.map(c => c.location))];

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-100 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto grid gap-8 font-sans">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">📊 Customer Insights Dashboard</h1>
        <p className="text-gray-600 text-sm">Visualize customer distribution and spending.</p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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

        <div className="flex gap-2">
          <button onClick={() => sortData('asc')} className={`flex items-center gap-1 px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition ${sortOrder === 'asc' ? 'ring-2 ring-blue-400' : ''}`}>
            <ArrowUp size={16} /> Asc
          </button>
          <button onClick={() => sortData('desc')} className={`flex items-center gap-1 px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition ${sortOrder === 'desc' ? 'ring-2 ring-blue-400' : ''}`}>
            <ArrowDown size={16} /> Desc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💰 Total Spent by Customer</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredCustomers.slice(0, 20)}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_spent" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📍 Customers by Location</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={Object.entries(customersByLocation).map(([key, value]) => ({ name: key, value }))} dataKey="value" outerRadius={100}>
                {Object.keys(customersByLocation).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>     


        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(ageDistribution).map(([key, value]) => ({ name: key, value }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💳 Spending Quartiles</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quartileData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
