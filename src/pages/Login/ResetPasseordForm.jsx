    import { faAnglesLeft, faLock, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import React, { useEffect, useRef, useState } from "react";
    import { useNavigate, useLocation} from "react-router-dom";
    import { auth } from "../../configs/firebaseConfig";
    import { RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from "@firebase/auth";
    import { PhoneAuthProvider } from "firebase/auth";
    import Cookies from "universal-cookie";
    import { encryptData } from "../../utils/cookies";
    import { convertPhoneNumber } from "../../utils/phoneNumber";

    export default function ResetPasseordForm() {
        const cookies = new Cookies();
        const navigate = useNavigate();
        const [password, setPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [otp, setOtp] = useState("");
        const [flag, setFlag] = useState(false);
        const [error, setError] = useState("")
        const location = useLocation()
        const phoneNumber = location.state?.phoneNumber;
        const [isSendOtp, setIsSendOtp] = useState(true);
        const [verificationId, setVerificationId] = useState(null);
        

        useEffect(()=> {
            sendOTP(convertPhoneNumber(phoneNumber));
        }, [])

       
        
        const sendOTP = async (phoneNumber) => {
            try {
                console.log(phoneNumber);
                const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
                await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
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
                console.error('Gửi mã OTP thất bại:', error);
                console.log('Gửi mã OTP thất bại');
            }
        };

        const handleResetPassword = async (e) => {
            e.preventDefault();
            if (password !== newPassword) {
                setFlag(true)
                setError("Xác nhận mật khẩu không chính xác")
                console.error("Failed reset password");
                return ;
            }

            const credential = PhoneAuthProvider.credential(verificationId.verificationId, otp);

            await signInWithCredential(auth, credential)
                .then(() => {
                    setOtp('')
                })
                .catch(error => {
                    setFlag(true)
                    setError("Mã xác thực không đúng")
                    console.error("Mã xác thực không đúng");
                    return;
                })

            
            try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/reset-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber: phoneNumber,
                        newPassword: newPassword,
                    }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                navigate("/auth/login");
                console.log("API call successful");
            } else {
                setFlag(true)
                setError(data.msg);
                console.error("API call failed");
            }
            } catch (error) {
                navigate("/auth/login");
                console.error("Error calling API:", error);
            }
        };
        
    return (
        <div className="flex-col">
            {isSendOtp&&<div id="recaptcha" className="flex justify-center mt-3"></div>}

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

            <form onSubmit={handleResetPassword}  className="mt-2  px-7">
                <div className="mx-2 mb-2 border-b-2 py-4">
                    <FontAwesomeIcon icon={faLock} className="mx-3" />
                    <input
                        id="input-password"
                        placeholder="Vui lòng nhập mật khẩu"
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
                        setNewPassword(event.target.value);
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
