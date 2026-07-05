import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isStaff = user.role === 'agent' || user.role === 'admin';

  const fetchTicket = () => {
    api.get(`/tickets/${id}`).then((res) => setTicket(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTicket();
    if (isStaff) {
      api.get('/users/agents').then((res) => setAgents(res.data));
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async (field, value) => {
    try {
      const res = await api.put(`/tickets/${id}`, { [field]: value });
      setTicket(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await api.post(`/tickets/${id}/comments`, { text: comment });
    setTicket(res.data);
    setComment('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket permanently?')) return;
    await api.delete(`/tickets/${id}`);
    navigate('/tickets');
  };

  if (loading) return <div className="page-center">Loading...</div>;
  if (!ticket) return <div className="page-center">Ticket not found.</div>;

  return (
    <div className="container narrow">
      <button className="btn-link" onClick={() => navigate('/tickets')}>← Back to tickets</button>
      {error && <div className="alert-error">{error}</div>}

      <div className="detail-card">
        <div className="detail-header">
          <h1>{ticket.title}</h1>
          <span className="pill">{ticket.status}</span>
        </div>
        <p className="ticket-meta">
          Opened by {ticket.createdBy?.name} on {new Date(ticket.createdAt).toLocaleString()}
        </p>
        <p className="detail-desc">{ticket.description}</p>

        <div className="detail-tags">
          <span className="pill outline">{ticket.category}</span>
          <span className="pill outline">{ticket.priority} priority</span>
          {ticket.assignedTo && <span className="pill outline">Assigned: {ticket.assignedTo.name}</span>}
        </div>

        {isStaff && (
          <div className="staff-controls">
            <h3>Staff Controls</h3>
            <div className="form-row">
              <div>
                <label>Status</label>
                <select value={ticket.status} onChange={(e) => handleUpdate('status', e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={ticket.priority} onChange={(e) => handleUpdate('priority', e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label>Assign to</label>
                <select
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleUpdate('assignedTo', e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {(user._id === ticket.createdBy?._id || user.role === 'admin') && (
          <button className="btn btn-danger" onClick={handleDelete}>Delete Ticket</button>
        )}
      </div>

      <div className="comments-section">
        <h3>Comments ({ticket.comments.length})</h3>
        {ticket.comments.map((c) => (
          <div key={c._id} className="comment">
            <div className="comment-header">
              <strong>{c.author?.name}</strong>
              <span className="badge-small">{c.author?.role}</span>
              <span className="ticket-meta">{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <p>{c.text}</p>
          </div>
        ))}
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            rows={3}
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
