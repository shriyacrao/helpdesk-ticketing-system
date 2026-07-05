import { useEffect, useState } from 'react';
import api from '../api/axios';
import TicketCard from '../components/TicketCard';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });

  const fetchTickets = () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    api
      .get('/tickets', { params })
      .then((res) => setTickets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTickets, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Tickets</h1>
      </div>

      <form className="filter-bar" onSubmit={applyFilters}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option>Hardware</option>
          <option>Software</option>
          <option>Network</option>
          <option>Account</option>
          <option>Other</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit" className="btn btn-outline">Filter</button>
      </form>

      {loading ? (
        <div className="page-center">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="page-center">No tickets found.</div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;
