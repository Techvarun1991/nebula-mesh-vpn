import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Nebula VPN</h2>
        <nav className="space-y-2">
          <Link to="/admin-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            🏠 Dashboard
          </Link>
          <Link to="/admin-users" className="block py-2 px-4 rounded hover:bg-gray-700">
            👥 Users
          </Link>
          <Link to="/admin-nodes" className="block py-2 px-4 rounded hover:bg-gray-700">
            🌐 Nodes
          </Link>
          <Link to="/admin-settings" className="block py-2 px-4 rounded hover:bg-gray-700">
            ⚙ Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">✅ Overview</h1>
        <div className="bg-white p-6 rounded shadow-md">
          <p className="mb-2">🔹 Active Lighthouse: <span className="text-green-600 font-bold">🟢 Running</span></p>
          <p className="mb-2">🔹 Total Nodes: 10 | Alive: 8 | Dead: 2</p>
          <p className="mb-2">🔹 Total Users: 5 | Active: 4 | Inactive: 1</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            📥 Download Peer Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
