import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.get('/users').then((res) => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const changeRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    fetchUsers();
  };

  if (loading) return <div className="page-center">Loading users...</div>;

  return (
    <div className="container">
      <h1>Manage Users</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className="badge">{u.role}</span></td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="agent">agent</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
