import React from 'react'
import { useForm } from 'react-hook-form'
import { data } from 'react-router-dom'
// import './Signup.css'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/signup", data)
      alert(res.data.message)
      navigate("/login")
    }
    catch (err) {
      if (err.response) {
        alert(err.response.data.message)
      } else {
        alert("Something went wrong!")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 sm:px-4 py-6 sm:py-8">

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-5 sm:p-6">

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Create your account
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">
          Join teams, collaborate, and build together
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 sm:mt-6 space-y-4"
        >

          <div>
            <input
              {...register("fullname", {
                required: "Full name is required",
                // minLength: { value: 5, message: "Minimum 5 characters" },
                // maxLength: { value: 50, message: "Maximum 10 characters" }
              })}
              placeholder="Full Name"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullname.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("universityId", {
                required: "University Id is required",
                // minLength: { value: 5, message: "Minimum 5 characters" },
                // maxLength: { value: 10, message: "Maximum 10 characters" }
              })}
              placeholder="University ID"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.universityId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.universityId.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("email", {
                required: "Email is required"
              })}
              placeholder="Email"
              type="email"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("password", {
                required: "Password is required",
                // minLength: { value: 5, message: "Minimum 5 characters" },
                // maxLength: { value: 10, message: "Maximum 10 characters" }
              })}
              placeholder="Password"
              type="password"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("skills", {
                required: "Skills are required"
              })}
              placeholder="Skills (e.g. React, Node, MongoDB)"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skills.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("college", {
                required: "College is required"
              })}
              placeholder="College"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.college && (
              <p className="text-red-500 text-sm mt-1">
                {errors.college.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("course", {
                required: "Course is required"
              })}
              placeholder="Course"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.course && (
              <p className="text-red-500 text-sm mt-1">
                {errors.course.message}
              </p>
            )}
          </div>


          <div>
            <input
              {...register("year", {
                required: "Passing year is required"
              })}
              placeholder="Passing Year"
              type="number"
              className="w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.year && (
              <p className="text-red-500 text-sm mt-1">
                {errors.year.message}
              </p>
            )}
          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 sm:py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

        </form>


        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default Signup