import LoginForm from "../pages/Login/LoginForm";
import Main from "../pages/Home/MainHome";
import Contact from "../pages/Contact";
import Todo from "../pages/Todo";
import Message from "../pages/Message";
import OtherMessage from "../pages/Message/OtherMessage";
import Sidebar from "../layouts/dashboard/Sidebar";
import Welcome from "../pages/Home/Welcome";
// import MessageLayout from "../layouts/dashboard/Message";

import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import MessageFilterBar from "../pages/Message/MessageFilterBar";
import SearchBox from "../components/SearchBox";
import Conversation from "../components/Conversation";
import DetailContact from "../components/DetailContact";
import { set } from "date-fns";

import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "../pages/Login/ForgotPasswordForm";
import ResetPasseordForm from "../pages/Login/ResetPasseordForm";
// import VideoCall from "../pages/VideoCalll";
import TagFriendRequest from "../pages/Contact/TagFriendRequest";

import ConversationGroup from "../components/ConversationGroup";
import RegisterUser from "../pages/Login/RegisterUser";


import ProtectedRoute from "../components/ProtectedRoute";
import UnprotectedRoute from "../components/UnprotectedRoute";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const [comp, setComp] = useState(<Conversation />);


  const [openSearchMessage, setOpenSearchMessage] = useState(false);



  return useRoutes([
    {
      path: "/auth",
      element: (
        <UnprotectedRoute>
          <AuthLayout />,
        </UnprotectedRoute>
      ),
      children: [
        { path: "login", element: <LoginForm /> },
        { path: "forgot-password", element: <ForgotPasswordForm /> },
        { path: "reset-password", element: <ResetPasseordForm /> },
        { path: "register-user", element: <RegisterUser /> },
      ],
    },
    {
      path: "/",
      element: (
        // <ProtectedRoute>
          <DashboardLayout component={comp} />
        // </ProtectedRoute>
      ),
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
        {
          path: "/contact",
          element: <SearchBox />,
          children: [
            {
              path: "listFriend",
              element: <DetailContact isListFriend={true} />,
            },
            {
              path: "listGroup",
              element: <DetailContact isListFriend={false} />,
            },
            { path: "listFriend/chat", element: <Conversation /> },
            { path: "listGroup/chatGroup", element: <ConversationGroup /> },
            { path: "listFriendRequest", element: <TagFriendRequest /> },
          ],
        },
        { path: "todo", element: <Todo /> },
        // { path: "videocall", element: <VideoCall/> },
      ],
    },
  ]);
}
// { path: "/contact", element: [<SearchBox />, <Contact />] },

// const GeneralApp = Loadable(
//   lazy(() => import("../pages/dashboard/GeneralApp"))
// );
// const Conversation = Loadable(
//   lazy(() => import("../pages/dashboard/Conversation"))
// );
// const Chats = Loadable(lazy(() => import("../pages/dashboard/Chats")));
// const Group = Loadable(lazy(() => import("../pages/dashboard/Group")));
// const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
// const Contact = Loadable(lazy(() => import("../sections/dashboard/Contact")));
// const Page404 = Loadable(lazy(() => import("../pages/Page404")));

// const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
// const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));
// const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
// const ResetPasswordPage = Loadable(
//   lazy(() => import("../pages/auth/ResetPassword"))
// );
// const NewPasswordPage = Loadable(
//   lazy(() => import("../pages/auth/NewPassword"))
// );

// // Settings
// const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
// const Profile = Loadable(
//   lazy(() => import("../pages/dashboard/Settings/Profile"))
// );
