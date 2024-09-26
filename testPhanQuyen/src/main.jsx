import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthWrapper } from './component/context/auth.context.jsx';
import UserManagement from "./pages/user.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/user",
    element: <UserManagement/>
  },
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)
