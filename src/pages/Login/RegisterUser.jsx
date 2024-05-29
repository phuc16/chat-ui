import React, { useEffect, useRef, useState } from "react";

import { faAnglesLeft, faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation} from "react-router-dom";
import { auth } from "../../configs/firebaseConfig";
import { RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from "@firebase/auth";
import { PhoneAuthProvider } from "firebase/auth";
import { convertPhoneNumber } from "../../utils/phoneNumber";



export default function RegisterUser() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState("")
    const location = useLocation()
    const [phoneNumber, setPhoneNumber] = useState(location.state?.phoneNumber);
    const [isSendOtp, setIsSendOtp] = useState(true);
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);

    const setUpRecaptcha = () => {
        window.recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
      };
    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            console.log(auth);
            console.log(phoneNumber);
            setUpRecaptcha();
            const recaptcha = window.recaptcha
            await signInWithPhoneNumber(auth, convertPhoneNumber(phoneNumber), recaptcha)
                .then((confirmationResult) => {
                    setIsSendOtp(false);
                    console.log(confirmationResult);
                    setVerificationId(confirmationResult)
                    console.log("OTP sended successfully!");
                })
                .catch((error) => {
                    console.log(error);
                });
        
        } catch (error) {
            setFlag(true)
            setError("Gửi mã OTP thất bại")
            console.error('Gửi mã OTP thất bại:', error);
            console.log('Gửi mã OTP thất bại', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== verifyPassword) {
            setFlag(true)
            setError("Xác nhận mật khẩu không chính xác")
            console.error("Failed reset password");
            return ;
        }

        // const credential = PhoneAuthProvider.credential(verificationId.verificationId, otp);

        // await signInWithCredential(auth, credential)
        //     .then(() => {
        //         setOtp('')
        //     })
        //     .catch(error => {
        //         setFlag(true)
        //         setError("Mã xác thực không đúng")
        //         console.error("Mã xác thực không đúng", error);
        //         return;
        //     })
        
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/register`,
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
            if (response.ok) {
                navigate("/auth/login");
                console.log("API call successful");
            } else {
                setFlag(true)
                setError(data.msg)
                console.error("API call failed");
            }
        } catch (error) {
            navigate("/");
            console.error("Error calling API:", error);
        }
    };

return (
    <div>

        <h3 className="text-center text-xl mt-10">Tạo tài khoản</h3>

        <form  className="mt-2  px-7">
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
            
            {isSendOtp&&<div id="recaptcha" className="flex justify-center mt-3"></div>}
            {!isSendOtp &&
            <div>
                <div className="text-center bg-blue-50 mb-2 border-b-2 py-4 m-10">
                    <p className="text-xs">Gửi tin nhắn để nhận mã xác thực</p>
                    <p className="text-blue-400 font-bold text-xl p-2">{phoneNumber}</p>
                    <input 
                        id="input-password"
                        placeholder="Nhập mã kích hoạt"
                        className=" focus:outline-none py-2 px-5 text-center rounded-lg border-b-2"
                        onChange={(event) => {
                        setOtp(event.target.value);
                        }}
                    ></input>
                </div>
            </div>
            }
            <div className="mt-6 px-2">
                <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    // type="submit"
                    onClick={handleSendOTP}
                >
                    Xác thực
                </button>
            </div>
            </form>
            <form onSubmit={handleRegister}  className="mt-2  px-7">
            <div className="mx-2 mb-2 border-b-2 py-4">
                <FontAwesomeIcon icon={faLock} className="mx-3" />
                <input
                    id="input-password"
                    placeholder="Gồm 2-40 kí tự"
                    className="mx-3 px-3 focus:outline-none"
                    onChange={(event) => {
                    setPassword(event.target.value);
                    }}
                ></input>
            </div>

            <div className="mx-2 mb-2 border-b-2 py-4">
                <FontAwesomeIcon icon={faLock} className="mx-3" />
                <input
                    id="input-password"
                    placeholder="Nhập lại mật khẩu"
                    className="mx-3 px-3 focus:outline-none"
                    onChange={(event) => {
                    setVerifyPassword(event.target.value);
                    }}
                ></input>

            </div>

            {flag && <div className="mx-2 mb-2 py-4">
                <span>
                    <p className="text-red-600" >{error}</p>
                </span>
            </div>}

            <div className="mt-6 px-2">
                <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    type="submit"
                >
                    Xác nhận
                </button>
            </div>

            
        </form>


        
    </div>
)
}
