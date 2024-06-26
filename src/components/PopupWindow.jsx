import { Cloudinary } from '@cloudinary/url-gen';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from "universal-cookie"

export default function PopupWindow({ isOpen, onClose, data, phoneNumber, token }) {
  const [loadAvt, setLoadAvt] = useState(data.avatar);
  const inputFileRef = useRef(null);
  const navigate = useNavigate();
  const dateTime = new Date(data.birthday);
  const [userName, setUserName] = useState(data.userName);
  const [gender, setGender] = useState(data.gender ? 'male' : 'female');
  const [dob, setDob] = useState(new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()));
  const [phone, setPhone] = useState(phoneNumber);
  if (!data) {
    return null;
  }
  const cloudinary = new Cloudinary({ cloud: { cloudName: 'du73a0oen' } });
  const cookies = new Cookies();
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'bsqsytxl');
    try {
      let newAvatar = '';
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/du73a0oen/image/upload",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formData,
        },
      )
        .then(response => response.json())
        .then(data => newAvatar = data.secure_url);

      console.log("newAvatar", newAvatar);
      const jsonAvt = { newAvatar: newAvatar }
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/api/v1/account/change-avatar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonAvt),
        },
      )
      if (res.status === 401) {
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
        throw new Error("Unauthorized");
      }
      if (res.ok) {
        setLoadAvt(newAvatar)
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      console.log("handleUpdateProfile")
      console.log(userName, gender, dob)
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/api/v1/account/change-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userName: userName,
            gender: gender === 'male',
            birthday: dob
          }),
        },
      )
      if (res.status === 401) {
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
        throw new Error("Unauthorized");
      }
      if (res.ok) {
      }

    } catch (error) {
      console.error('Error update profile:', error);
    }
  };

  const handleAvatarClick = () => {
    inputFileRef.current.click();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
              {/* Content of the popup */}

              <div className='flex items-center p-4'>
                <p className='flex-grow'>Thông tin tài khoản</p>

                <p className="bg-gray-50 w-10 text-center cursor-pointer" onClick={() => { onClose(); navigate("/app", { state: { avt: loadAvt, token: token, phoneNumber: phoneNumber } }) }}>X</p>

              </div>


              <div className="relative bg-cover bg-center bg-no-repeat p-4 h-44 mb-20" style={{ backgroundImage: `url(${data.background})` }}>
                <div className="absolute top-48 left-4 transform -translate-y-1/2">
                  {/* =============================================== */}
                  <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  <img className="w-20 h-20 rounded-full border-4 border-white" onClick={handleAvatarClick} src={loadAvt} alt="Avatar" />

                </div>
                <div className="absolute top-52 left-4 transform -translate-y-1/2  pl-28">
                  <h2 className=" text-lg font-semibold">{data.userName}</h2>
                  {/* <p className=" text-sm">Lorem ipsum dolor sit amet</p> */}
                </div>
              </div>


              <hr className='bg-slate-200 h-1.5' />

              <div className='m-3'>
                <p className='font-semibold'>Thông tin cá nhân</p>

                <div className='border-b border-gray-200'>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Bio</p>
                    <input
                      className='w-72 text-left text-gray-700'
                      type='text'
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Giới tính</p>
                    <select
                      className='w-72 text-left text-gray-700'
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value='male'>Nam</option>
                      <option value='female'>Nữ</option>
                    </select>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Ngày sinh</p>
                    <DatePicker
                      className='w-72 text-left text-gray-700'
                      selected={dob}
                      onChange={(date) => setDob(date)}
                      dateFormat='dd/MM/yyyy'
                    />
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>Điện thoại</p>
                    <p className='w-72 text-left text-gray-700'>{phoneNumber}</p>
                  </div>
                  <div className='flex p-3'>
                    <p className='text-gray-700 flex-grow'>
                      Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
                    </p>
                  </div>
                </div>

                <div className='mt-6 px-2'>
                  <button
                    className='w-full transform rounded-md bg-white py-2 font-semibold tracking-wide text-black transition-colors duration-200'
                    type='submit'
                    onClick={handleUpdateProfile}
                  >
                    <FontAwesomeIcon className='mx-1' icon={faPenToSquare} />
                    Cập nhật
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};