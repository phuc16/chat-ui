import { faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import QR_Test from "./../../assets/QR_Test.png";
// import { WebSocket } from 'vite';

export default function AuthLayout() {
  const [isSelectQR, setIsSelectQR] = useState(true);
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [socket, setSocket] = useState(null);

  //=========================================================
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  //=========================================================
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  //=========================================================

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/authenticate/qr-code`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch QR code");
        }

        const data = await response.json();
        setQrCodeUrl("data:image/png;base64," + data.field2); 
        const socketLink = data.field1;
        const newSocket = new WebSocket(
          `${process.env.SOCKET_ACCOUNT}/ws/auth/` + data.field1,
        );
        console.log(data.field1);
        newSocket.onopen = () => {
          console.log("WebSocket connected");
        };

        setSocket(newSocket);
        return () => {
          newSocket.close();
        };
      } catch (error) {
        console.error("Error fetching QR code:", error.message);
      }
    };

    // fetchQrCode();
  }, []);

  useEffect(() => {
    if (socket) {
      handleReceiveToken();
    }
  });
  //=========================================================

  async function fetchData(link) {
    let response = await fetch(link);
    let data = await response.json();
    return data;
  }

  //===========================================
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/authenticate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password,
          }),
          // body: JSON.stringify({
          //   "phoneNumber": "0123456789",
          //   "password": "123"
          // }),
        },
      );

      if (response.ok) {
        const token = await response.json();
        console.log(">>>>>>>TOKEN>>>>>>>>>>", token.field);
        navigate("/app", {
          state: { token: token.field, phoneNumber: phoneNumber },
        });
        console.log("API call successful");
      } else {
        navigate("/auth/login");
        console.error("API call failed");
      }
    } catch (error) {
      navigate("/");
      console.error("Error calling API:", error);
    }
  };
  //===========================================
  const handleReceiveToken = () => {
    socket.onmessage = async (event) => {
      if (isJSON(event.data)) {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data.token !== null) {
          navigate("/app", { token: data.token });
        } else if (data.connect === "ACCEPT") {
          let device = navigator.userAgent.match("Windows") ? "Windows" : "MAC";
          let day = new Date();
          let time =
            day.getHours() + ":" + day.getMinutes() + ":" + day.getSeconds();
          let location = "TP.HCM";
          socket.send(
            JSON.stringify({ device: device, time: time, location: location }),
          );
        }
      }
    };
  };

  return (
    <div className="w-full">
      <div className="absolute inset-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1280 654"
          preserveAspectRatio="xMinYMin slice"
          className="absolute inset-0 h-full w-full"
          style={{ zIndex: -1 }}
        >
          <rect x="1" y="1" width="1280" height="654" fill="#e8f3ff" />
          <path
            fill="#e8f3ff"
            d="M1181.68 655C1163.95 469.296 1031.95 86.8402 963 1H1279V655H1181.68Z"
          />
          <path
            fill="#e8f3ff"
            d="M1.5 142.5C52.5 267 131.5 487 172 653H1.5V142.5Z"
          />
          <path
            fill="#aad6ff"
            d="M519.5 1.5H685H964.5C1046 135 1167 469 1180 655.5H767.5C704.5 505.5 604.5 304.5 464 148.5L519.5 1.5Z"
          />
          <path
            fill="#d0e4fc"
            d="M1 144V1.5H519.5C456 189 322.5 475.5 220 652.5H171.5C138.5 509 51.5 262.5 1 144Z"
          />
        </svg>
      </div>
      <div className="relative flex flex-col overflow-hidden">
        <div className="">
          <h1 className="mt-10 p-3 text-center text-6xl font-semibold text-[#0860F8]">
            Zalo
          </h1>
          <h2 className="text-center text-base font-normal text-[#333333]">
            Đăng nhập tài khoản Zalo
          </h2>
          <h2 className="text-center  text-base font-normal text-[#333333]">
            để kết nối với ứng dụng Zalo Web
          </h2>
        </div>

        <div className="mx-auto my-5 w-full bg-white pb-6 shadow-md lg:max-w-[388px]">
          <Outlet />
        </div>

        <div className="m-3 mt-10">
          <p className=" text-center text-xs text-blue-600">
            <a className="font-semibold">Tiếng Việt</a> <span> </span>
            &nbsp;&nbsp;
            <a className="">English </a>
          </p>
        </div>
      </div>
    </div>
  );
}
