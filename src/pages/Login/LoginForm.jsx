import { faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QR_Test from "./../../assets/QR_Test.png";
import Cookies from "universal-cookie";
import { encryptData } from "../../utils/cookies";
import { convertPhoneNumber } from "../../utils/phoneNumber";

export default function LoginForm() {
  const cookies = new Cookies();

  const [token, setToken] = useState(null);

  const [isSelectQR, setIsSelectQR] = useState(true);
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("")

  const setTokenInCookie = (tokenValue) => {
    cookies.set("token", tokenValue, {
      expires: new Date(Date.now() + 86400e3),
    });
  };

  const setPhoneNumberInCookie = (phoneNumberValue) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    cookies.set("phoneNumber", phoneNumberValue, {
    });
  };


  useEffect(() => {
    
  }, []);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password,
          }),
        },
      );
      const data = await response.json();
      if (response.status === 401) {
        setFlag(true);
        setError(data.msg)
        console.error("Failed login");
        return;
      }

      if (response.ok) {
        console.log(token)
        localStorage.setItem("token", data.accessToken);
        navigate("/app", {
          state: { token: data.accessToken, phoneNumber: phoneNumber },
        });
        const allCookies = cookies.getAll();
        for (const cookieName in allCookies) {
          if (allCookies.hasOwnProperty(cookieName)) {
            cookies.remove(cookieName, {
              path: "/",
            });
            cookies.remove(cookieName, {
              path: "/auth",
            });
          }
        }
        localStorage.clear();
        setTokenInCookie(data.accessToken);
        setPhoneNumberInCookie(phoneNumber);

        console.log("API call successful");
      } else {
        console.log(data)
        setFlag(true)
        setError(data.msg)
        console.error("API call failed");
      }
    } catch (error) {
      navigate("/");
      console.error("Error calling API:", error);
    }
  };

  const phoneRegex = /^\d{10}$/;

  return (
    <div>
      {!isSelectQR ? (
        <>
          <ul className="flex border-b-2 py-3">
            <li
              className="flex-1 text-center font-thin"
              onClick={() => setIsSelectQR(true)}
            >
              VỚI MÃ QR
            </li>
            <span className="font-thin text-slate-300">|</span>
            <li className="flex-1 text-center font-medium">
              VỚI SỐ ĐIỆN THOẠI
            </li>
          </ul>

          <form onSubmit={handleSubmitLogin} className="mt-2  px-6">
            <div className="-ml-2 w-full items-center">
              <div className="mx-2 mb-2 flex w-full items-center border-b-2 py-4">
                <FontAwesomeIcon icon={faMobileScreen} className="mx-3" />

                <input
                  id="input-phone"
                  placeholder="Số điện thoại"
                  className="mr-1 w-full px-3 py-1 focus:outline-none"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                ></input>
              </div>
            </div>

            <div className="mx-2 mb-2 border-b-2 py-4">
              <FontAwesomeIcon icon={faLock} className="mx-3" />
              <input
                id="input-password"
                type="password"
                placeholder="Mật khẩu"
                className="mx-3 w-64 px-3 focus:outline-none"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              ></input>
            </div>

            {flag && (
              <div className="mx-2 mb-2 py-4">
                <span>
                  <p className="text-red-600">
                    { phoneRegex.test(phoneNumber) ? error : 'Số điện thoại phải đủ 10 số và không bao gồm ký tự'}
                  </p>
                </span>
              </div>
            )}

            <div className="mt-6">
              <button
                className="w-full transform rounded-md bg-[#0D86EB] py-2 tracking-wide text-white transition-colors duration-200"
                type="submit"
              >
                Đăng nhập với mật khẩu
              </button>
            </div>
          </form>

          <div className="flex">
            <p className="flex-1 mt-8 text-center text-xs font-light text-gray-700">
              <a
                onClick={() => navigate('/auth/register-user')}
                className="text-black-100 font-medium hover:underline"
              >
                Đăng ký tài khoản
              </a>
            </p>

            <p className="mt-8 flex-1 text-center text-xs font-light text-gray-700">
              <a
                onClick={() => {
                  if (!flag) {
                    navigate("/auth/forgot-password");
                  } else {
                    navigate("/auth/forgot-password", {
                      state: { phoneProp: phoneNumber },
                    });
                  }
                }}
                className="text-black-100 font-medium hover:underline"
              >
                Quên mật khẩu?
              </a>
            </p>
          </div>
        </>
      ) : (
        <>
          <ul className="flex border-b-2 py-3">
            <li className="flex-1 text-center font-medium">VỚI MÃ QR</li>
            <span className="font-thin text-slate-300">|</span>
            <li
              className="flex-1 text-center font-thin"
              onClick={() => setIsSelectQR(false)}
            >
              VỚI SỐ ĐIỆN THOẠI
            </li>
          </ul>

          <div className="m-6 mx-20 flex flex-col items-center rounded-lg border-2">
            <img
              src={qrCodeUrl}
              alt="QR"
              className="my-3"
              style={{ width: 200, height: 200, borderRadius: 5 }}
            />

            <p className="w-60 text-center text-base font-normal text-[#0862ED]">
              Chỉ dùng để đăng nhập
            </p>

            <p className="text-black-600 mb-3 w-60 text-center text-base font-normal">
              Zalo trên máy tính - TODO
            </p>
          </div>

          <p className="-mt-1 mb-6 text-center text-xs font-medium text-gray-600">
            Sử dụng ứng dụng Zalo để quét mã QR
          </p>
        </>
      )}
    </div>
  );
}
