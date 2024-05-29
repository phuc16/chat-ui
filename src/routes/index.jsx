import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";

import AuthLayout from "../layouts/auth";
import DashboardLayout from "../layouts/dashboard";

import Welcome from "../pages/Home/Welcome";

import LoginForm from "../pages/Login/LoginForm";
import ForgotPasswordForm from "../pages/Login/ForgotPasswordForm";
import ResetPasseordForm from "../pages/Login/ResetPasseordForm";
import RegisterUser from "../pages/Login/RegisterUser";

import Message from "../pages/Message";
import OtherMessage from "../pages/Message/OtherMessage";
import MessageFilterBar from "../pages/Message/MessageFilterBar";

import Conversation from "../components/Conversation";
import ConversationGroup from "../components/ConversationGroup";

export default function Router() {
  const [comp, setComp] = useState(<Conversation />);

  const location = useLocation();

  const [openSearchMessage, setOpenSearchMessage] = useState(false);

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
    },
    {
      path: "/",
      element: <DashboardLayout component={comp}></DashboardLayout>,
      children: [
        { element: <Navigate to="/app" replace />, index: true },
        {
          path: "/app",
          element: <MessageFilterBar />,
          children: [
            { path: "", element: <Welcome /> },
            {
              path: "chat",
              element: (
                <Conversation setOpenSearchMessage={setOpenSearchMessage} />
              ),
            },
            { path: "chatGroup", element: <ConversationGroup /> },
          ],
        },
      ],
    },
  ]);
}