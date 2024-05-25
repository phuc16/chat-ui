import * as React from "react";
import { useRoutes } from "react-router-dom";

import AuthLayout from "../layouts/auth";

import LoginForm from "../pages/Login/LoginForm";
import ForgotPasswordForm from "../pages/Login/ForgotPasswordForm";
import ResetPasseordForm from "../pages/Login/ResetPasseordForm";
import RegisterUser from "../pages/Login/RegisterUser";

export default function Router() {
    return useRoutes([
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LoginForm /> },
            { path: "forgot-password", element: <ForgotPasswordForm /> },
            { path: "reset-password", element: <ResetPasseordForm /> },
            { path: "register-user", element: <RegisterUser /> },
        ],
      }
    ]);
  }