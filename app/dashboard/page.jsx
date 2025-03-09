"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setFilteredAppointments(data);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(
      (a) =>
        a.userName?.toLowerCase().includes(search.toLowerCase()) ||
        a.userPhone?.includes(search)
    );
    setFilteredAppointments(filtered);
    setPage(1);
  }, [search, appointments]);

  const paginatedData = filteredAppointments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-semibold text-center  mb-6 bg-gradient-to-r text-black p-4 shadow-md">
        Appointments Dashboard
      </h1>

      <input
        type="text"
        className="w-full p-3 border-2 border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((appointment) => (
          <div key={appointment?.id} className="bg-white shadow-lg rounded-xl p-5 border-2 border-gray-200 transition-transform hover:scale-105 hover:border-gray-500">
            <h2 className="text-xl font-semibold text-gray-800">{appointment?.userName}</h2>
            <p className="text-gray-600">📞 {appointment?.mobileNumber}</p>
            <p className="text-gray-600">📅 {appointment?.appointmentDate}</p>
            <p className="text-gray-600">⏰ {appointment?.appointmentTime}</p>
            {appointment?.issueDescription && <p className="text-gray-600"> {appointment?.issueDescription}</p>}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          className="px-5 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-800"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="font-semibold text-gray-700">Page {page}</span>

        <button
          className="px-5 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-800"
          disabled={page * pageSize >= filteredAppointments.length}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
