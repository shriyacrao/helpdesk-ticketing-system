import { Link } from 'react-router-dom';

const statusColors = {
  Open: '#e67e22',
  'In Progress': '#2980b9',
  Resolved: '#27ae60',
  Closed: '#7f8c8d',
};

const priorityColors = {
  Low: '#95a5a6',
  Medium: '#f39c12',
  High: '#e74c3c',
};

const TicketCard = ({ ticket }) => {
  return (
    <Link to={`/tickets/${ticket._id}`} className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.title}</h3>
        <span className="pill" style={{ backgroundColor: statusColors[ticket.status] }}>
          {ticket.status}
        </span>
      </div>
      <p className="ticket-desc">{ticket.description.slice(0, 100)}{ticket.description.length > 100 ? '...' : ''}</p>
      <div className="ticket-card-footer">
        <span className="pill outline">{ticket.category}</span>
        <span className="pill" style={{ backgroundColor: priorityColors[ticket.priority] }}>
          {ticket.priority}
        </span>
        <span className="ticket-meta">By {ticket.createdBy?.name || 'Unknown'}</span>
        {ticket.assignedTo && <span className="ticket-meta">→ {ticket.assignedTo.name}</span>}
      </div>
    </Link>
  );
};

export default TicketCard;
