import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
      toast.success("User status updated");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-[1400px] w-full">
        <h1 className="text-3xl font-syne font-bold mb-8">User Management</h1>

        <div className="glass-card p-6 min-h-[500px]">
          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bgTertiary border border-borderDefault px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-redSos min-w-[300px]"
            />
          </div>

          {loading ? (
             <div className="text-center py-12 text-textMuted">Loading users...</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-borderDefault text-textMuted text-xs uppercase">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Alerts Sent</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Joined</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-textSecondary">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="border-b border-borderDefault hover:bg-bgTertiary transition-colors">
                      <td className="p-4 font-bold text-textPrimary">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">{user.totalAlertsSent || 0}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? 'bg-greenSafe/20 text-greenSafe' : 'bg-redSos/20 text-redSos'}`}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggle(user._id)} 
                          className="text-textSecondary hover:text-white underline font-semibold"
                        >
                          {user.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan="7" className="p-8 text-center text-textMuted">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
