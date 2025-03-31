import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

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

  const customersByLocation = filteredCustomers.reduce((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(customersByLocation).map(location => ({
    name: location,
    value: customersByLocation[location],
  }));

  const ageDistribution = filteredCustomers.reduce((acc, curr) => {
    const ageGroup = `${Math.floor(curr.age / 10) * 10}s`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});

  const ageData = Object.keys(ageDistribution).map(ageGroup => ({
    name: ageGroup,
    value: ageDistribution[ageGroup],
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

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-64 bg-gray-100 rounded" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Customer Insights Dashboard</h1>
        <p className="text-gray-600 text-sm">Visualize customer distribution and spending by location.</p>
      </header>

      {/* Bar Chart - Spending */}
      <section className="mb-12 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 Total Spent per Customer</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredCustomers}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_spent" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Pie Chart - Location */}
      <section className="mb-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📍 Customers by Location</h2>
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
      </section>

      {/* Line Chart - Age Distribution */}
      <section className="mb-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 Age Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ageData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default Dashboard;