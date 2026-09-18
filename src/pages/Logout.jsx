import React from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      alert("Successfully logged out");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 sm:px-4 py-6">

      <div className="bg-white shadow-lg rounded-xl p-5 sm:p-6 w-full max-w-sm text-center">

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Ready to leave?
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm mt-2">
          You’ll be logged out from your account.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2.5 sm:py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Log Out
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full border border-gray-300 text-gray-700 py-2.5 sm:py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default Logout;