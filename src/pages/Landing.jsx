import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 text-center">

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        DevTeamUp
      </h1>

      <p className="text-sm sm:text-base text-gray-600 max-w-xl mb-7 sm:mb-8">
        Find teammates by skills, build teams for hackathons,
        and collaborate effortlessly.
      </p>

      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">

        <Link
          to="/signup"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="w-full sm:w-auto border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Login
        </Link>

      </div>

    </div>
  );
};

export default Landing;