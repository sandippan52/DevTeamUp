import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreateTeam from "./pages/CreateTeam";
import JoinRequest from "./pages/JoinRequest";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Notification from "./pages/Notification";
import TeamChat from "./pages/TeamChat";
import UserProfile from "./pages/UserProfile";

const router = createBrowserRouter([

  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },


  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/createteam",
    element: (
      <ProtectedRoute>
        <Navbar />
        <CreateTeam />
      </ProtectedRoute>
    ),
  },
  {
    path: "/joinrequest",
    element: (
      <ProtectedRoute>
        <Navbar />
        <JoinRequest/>
      </ProtectedRoute>
    ),
  },
  {
path: "/notification",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Notification/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path:"/team/:teamId/chat",
    element : (<TeamChat/>)
  },
  {
    path:"/users/:userId",
    element :(<UserProfile />)
  },
  {
    path: "/logout",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Logout />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
