import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Customer Insights Dashboard</h1>
      {summary ? (
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default App;