import React, { useState } from 'react';

const UserDashboard = () => {
  // Dummy data for the table
  const members = [
    { node_name: 'John Michael', email: 'john@creative-tim.com', function: '10.0.23.1',  status: 'RUNNING', employed: '23/04/18' },
    { node_name: 'Alexa Liras', email: 'alexa@creative-tim.com', function: '10.0.23.1', status: 'OFFLINE', employed: '23/04/18' },
    { node_name: 'Laurent Perrier', email: 'laurent@creative-tim.com', function: '10.0.23.1', status: 'OFFLINE', employed: '19/09/17' },
    { node_name: 'Michael Levi', email: 'michael@creative-tim.com', function: '10.0.23.1',  status: 'RUNNING', employed: '24/12/08' },
    { node_name: 'Richard Gran', email: 'richard@creative-tim.com', function: '10.0.23.1',  status: 'OFFLINE', employed: '04/10/21' },
  ];

  // State for sorting and pagination
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 45; // Total items as per the image
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Sorting logic (for demo purposes, sorting the dummy data)
    members.sort((a, b) => {
      if (direction === 'asc') {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
  };

  // Pagination logic
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Nodes List</h2>
          <p className="text-gray-500">See information about all nodes</p>
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 px-4 py-2 rounded">VIEW ALL</button>
          <button className="border border-gray-300 px-4 py-2 rounded flex items-center">
            <span className="mr-2">+</span> ADD MEMBER
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-4">
        <button className="border border-gray-300 px-4 py-2 rounded bg-gray-100">ALL</button>
        <button className="border border-gray-300 px-4 py-2 rounded">MONITORED</button>
        <button className="border border-gray-300 px-4 py-2 rounded">UNMONITORED</button>
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 px-4 py-2 rounded flex-1"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  <span>Node Name</span>
                  <button onClick={() => handleSort('node_name')} className="ml-2">
                    {sortConfig.key === 'node_name' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  <span>IP Address</span>
                  <button onClick={() => handleSort('function')} className="ml-2">
                    {sortConfig.key === 'function' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  <span>Status</span>
                  <button onClick={() => handleSort('status')} className="ml-2">
                    {sortConfig.key === 'status' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  <span>Created At</span>
                  <button onClick={() => handleSort('employed')} className="ml-2">
                    {sortConfig.key === 'employed' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </th>
              <th className="py-2 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-semibold">{member.node_name}</p>
                    <p className="text-gray-500">{member.email}</p>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <p>{member.function}</p>
                  {/* <p className="text-gray-500">{member.department}</p> */}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'RUNNING' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="py-2 px-4">{member.employed}</td>
                <td className="py-2 px-4">
                  <button className="text-gray-500">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-500">
          Showing {currentPage * itemsPerPage - itemsPerPage + 1}–{currentPage * itemsPerPage} of {totalItems}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border border-gray-300 px-4 py-2 rounded"
          >
            Prev
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`border border-gray-300 px-4 py-2 rounded ${
                currentPage === page ? 'bg-gray-800 text-white' : ''
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border border-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;