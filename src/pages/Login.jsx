import React from 'react'
import api from '../api/axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'



const Login = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e)=>{
   e.preventDefault();
   setError("");
   try{
    await api.post("/login",{email, password});
    navigate("/createteam")
   }
   catch(err){
    setError(err.response?.data?.message || "Login failed");
   }


  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        
      
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome back
        </h2>
        <p className="text-gray-500 text-sm text-center mt-1">
          Login to continue building teams
        </p>

        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
export default Login

