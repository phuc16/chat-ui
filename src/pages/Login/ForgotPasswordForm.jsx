import { faAnglesLeft, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPhoneNumber } from "../../utils/phoneNumber";

export default function ForgotPasswordForm() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [flag, setFlag] = useState(false);
    const location = useLocation();
    const phoneProp = location.state?.phoneProp;

    useEffect(() => {
        console.log(phoneProp);
        if (phoneProp!==undefined) {
            
            setPhoneNumber(phoneProp);
        }
    }, [])


    const handleCheckPhoneNumber = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_HOST}/api/users/check-phone`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    phoneNumber: phoneNumber,
                  }),
                },
              );
            console.log(response);
            if (response.ok) {
                navigate("/auth/reset-password", {state:{phoneNumber:phoneNumber}});
            } else {
                setFlag(true);
            }

            
        } catch (error) {
          navigate("/");
          console.error("Error calling API:", error);
        }
    };

  return (
    <div>
        <h3 className="text-center mt-10">Nhập số điện thoại của bạn</h3>

        <form onSubmit={handleCheckPhoneNumber} className="mt-2  px-7">
            <div className="mx-2 mb-2 border-b-2 py-4">

                <input
                    id="input-phone"
                    placeholder="Số điện thoại"
                    className="px-3 focus:outline-none "
                    value={phoneNumber}
                    onChange={(event) => {
                        setPhoneNumber(event.target.value);
                    }}
                ></input>
            </div>

            {flag && <div className="mx-2 mb-2 py-4">
                <span>
                    <p className="text-red-600" >Số điện thoại không tồn tại</p>
                </span>
            </div>}

            <div className="mt-6 px-2">
                <button
                    className="w-full transform rounded-md bg-blue-400 py-2 tracking-wide text-white transition-colors duration-200"
                    type="submit"
                >
                    Tiếp tục
                </button>
            </div>

            
        </form>

        <p className="mx-10 my-4 font-light text-gray-700">
            <a
              onClick={() => navigate('/auth/login')}
              className="text-black-100 font-normal text-xs hover:underline"
            >
              <FontAwesomeIcon icon={faAnglesLeft} /> Quay lại
            </a>
            
        </p>

        
    </div>
  )
}
