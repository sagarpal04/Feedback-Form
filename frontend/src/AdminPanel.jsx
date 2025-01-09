import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch responses from the backend
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/responses");
        setResponses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  // Delete all responses for a user
  const handleDeleteUser = async (userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete all responses for ${userName}?`
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/responses/${userName}`);
        setResponses(responses.filter((user) => user.user_name !== userName));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filtered and paginated data
  const filteredResponses = responses.filter((user) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Admin Panel - Feedback Responses
        </h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center">
            <div className="loader border-t-4 border-blue-500 w-8 h-8 mx-auto rounded-full animate-spin"></div>
            <p className="text-xl text-gray-500 mt-2">Loading...</p>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            No responses found.
          </div>
        ) : (
          <>
            <table className="w-full table-auto text-left border-collapse border border-gray-300">
              <thead>
                <tr className="border border-gray-300">
                  <th className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300">
                    Username
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedResponses.map((user) => (
                  <tr key={user.user_name} className="border border-gray-300">
                    <td className="px-4 py-3 font-bold border border-gray-300">
                      {user.user_name}
                    </td>
                    <td className="px-4 py-3 border border-gray-300 space-x-3 flex justify-between ">
                      <button
                        className="text-blue-500 underline hover:text-blue-700"
                        onClick={() => setModalData(user.responses)}
                      >
                        View
                      </button>
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-300"
                        onClick={() => handleDeleteUser(user.user_name)}
                      >
                        Delete All
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalData && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setModalData(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">User Responses</h3>
            <ul className="space-y-4">
              {modalData.map((resp, index) => (
                <li key={index} className="border-b pb-2">
                  <p>
                    <strong>Question:</strong> {resp.question}
                  </p>
                  <p>
                    <strong>Response:</strong> {resp.user_response}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                onClick={() => setModalData(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
