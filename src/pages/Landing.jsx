import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Hackathon Matcher 🚀
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Find teammates by skills, build teams for hackathons,
        and collaborate effortlessly.
      </p>

      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
