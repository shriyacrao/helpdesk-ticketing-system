import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateTicket = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/tickets', form);
      navigate(`/tickets/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create ticket');
    }
  };

  return (
    <div className="container narrow">
      <h1>New Support Ticket</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        {error && <div className="alert-error">{error}</div>}
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows={6} value={form.description} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Hardware</option>
              <option>Software</option>
              <option>Network</option>
              <option>Account</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
