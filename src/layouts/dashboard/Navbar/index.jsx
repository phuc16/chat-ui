import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import PopupWindow from "../../../components/PopupWindow";
import { set } from "date-fns";
import jsCookies from 'js-cookie';
import Cookies from "universal-cookie";
import { decryptData, encryptData } from "../../../utils/cookies";
import { useUser } from "../../../context/UserContext";
import { message, Space } from "antd";

// import fetch from "node-fetch";

function Navbar({ onNavbarReady }) {
  const cookies = new Cookies();
  const { setUserID } = useUser();

  const [phoneNumberCookies, setPhoneNumberCookies] = useState(null);
  const [tokenFromCookies, setTokenFromCookies] = useState(null);
  const [userID2, setUserID2] = useState(null);

  const [profileData, setProfileData] = useState(null);
  const [avatar, setAvatar] = useState("user-loading.jpg");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const token = location.state?.token;
  const phoneNumber = location.state?.phoneNumber;
  const avt = location.state?.avt;
  // console.log(avt); 
  // console.log("Token: ", token);
  // console.log("Phone Number: ", phoneNumber);

  useEffect(() => {

    if (token && phoneNumber) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_HOST}/api/v1/account/profile/${cookies.get("phoneNumber")}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${cookies.get("token")}`,
              },
            },
          );

          if (response.status === 401) {
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

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          // console.log(data);
          setProfileData(data);
          setAvatar(data.avatar);
          localStorage.setItem("avatar", data.avatar);
          localStorage.setItem("userID", data.userID);
          localStorage.setItem("userName", data.userName);
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("phone", phoneNumber);
          onNavbarReady(data.userID);
          setUserName(data.userName);
          const userIDTemp = data.userID;
          setUserID2(data.userID);
          setUserID(data.userID);
          // console.log(avatar);

          setUserIDInCookie(userIDTemp);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileData(null);
        }
      };

      fetchProfile();
    }
  }, [token, phoneNumber]);




  let messageImage = "/message-outline.png";
  let contactImage = "/contact-book-outline.png";
  let todoImage = "/todo-outline.png";

  if (location.pathname.startsWith("/app")) {
    messageImage = "/message.png";
  }
  if (location.pathname === "/contact") {
    contactImage = "/contact-selected.png";
  }
  if (location.pathname === "/todo") {
    todoImage = "/todo-selected.png";
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    // console.log(isPopupOpen);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // console.log(isPopupOpen);
  };

  const setUserIDInCookie = (userID) => {
    // Mã hóa userID trước khi lưu vào cookie
    const userIDEncoded = encryptData(userID);

    // Tính toán thời gian hết hạn bằng cách thêm số lượng millisecond tương ứng với một ngày vào thời điểm hiện tại
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Thêm một ngày

    // Đặt cookie userID với thời gian hết hạn và các tùy chọn bảo mật
    cookies.set("userID", userID, {
      expires: expirationDate,
      // Các tùy chọn bảo mật khác nếu cần
    });
  };

  useEffect(() => {
    // Lấy số điện thoại từ cookies và giải mã nó
    const phoneNumberFromCookie = cookies.get("phoneNumber");
    if (phoneNumberFromCookie) {
      // const phoneNumberDecrypted = decryptData(phoneNumberFromCookie);
      setPhoneNumberCookies(phoneNumberFromCookie);
    }

    const tokenFromCookie = cookies.get("token");
    if (tokenFromCookie) {
      // const tokenDecrypted = decryptData(tokenFromCookie);
      setTokenFromCookies(tokenFromCookie);
    }
    onNavbarReady();
  }, []);



  // Hàm để đặt token vào cookie
  // const setTokenInCookie = (tokenValue) => {
  //   // Mã hóa token trước khi lưu vào cookie
  //   const tokenEncoded = encryptData(tokenValue);

  //   // Tính toán thời gian hết hạn bằng cách thêm số lượng millisecond tương ứng với một ngày vào thời điểm hiện tại
  //   const expirationDate = new Date();
  //   expirationDate.setDate(expirationDate.getDate() + 1); // Thêm một ngày

  //   // Đặt cookie token với thời gian hết hạn và các tùy chọn bảo mật
  //   cookies.set('token', tokenEncoded, {
  //     expires: expirationDate,
  //     // Các tùy chọn bảo mật khác nếu cần
  //   });
  // };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.status === 401) {
        console.error("Failed logout");
        return;
      }

      if (response.ok) {
        console.log("API call successful");
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    };
  }

  /* Fix lỗi hiển thị avatar khi load lại dữ liệu */
  useEffect(() => {
    const avatarLoad = localStorage.getItem("avatar");
    if (avatarLoad) {
      setAvatar(avatarLoad);
    }
  }, []);


  // Gửi yêu cầu GET khi component được mount hoặc phoneNumber thay đổi
  useEffect(() => {
    if (token && phoneNumber) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVER_HOST}/api/v1/account/profile/${phoneNumber}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.status === 401) {
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

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          // console.log("data+++++++++++++++", data);
          console.log(data);
          console.log(data.avatar);
          setProfileData(data);
          setAvatar(data.avatar);
          localStorage.setItem("avatar", data.avatar);
          localStorage.setItem("userID", data.userID);
          localStorage.setItem("userName", data.userName);
          onNavbarReady(data.userID);
          setUserName(data.userName);
          const userIDTemp = data.userID;
          setUserID2(data.userID);
          setUserID(data.userID);
          // console.log(avatar);

          setUserIDInCookie(userIDTemp);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileData(null);
        }
      };

      fetchProfile();
    }
  }, [token, phoneNumber]);
  useEffect(() => {
    const avatarLoad = localStorage.getItem("avatar");
    if (avatarLoad) {
      setAvatar(avatarLoad);
    }
  }, []);
  // console.log("avt:"+avatar);

  const [messageApi, contextHolder] = message.useMessage();
  const showMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
      duration: 10,
    });
  };

  return (
    <>
      {contextHolder}
      <div className="fixed h-full w-16 bg-[#0091ff]  pt-[26px]">
        <nav className="w-full">
          <ul className="grid w-full items-center justify-center">
            <li className="pb-[14px]">
              <div className="">
                {profileData ? (
                  <Button
                    id="fade-button"
                    aria-controls={open ? "fade-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    disableTouchRipple
                  >
                    <div>
                      <img
                        src={localStorage.getItem("avatar")}
                        className="h-12 w-12 rounded-full border "
                        alt="avatar"
                      />
                    </div>
                  </Button>
                ) : (
                  <Button
                    id="fade-button"
                    aria-controls={open ? "fade-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    disableTouchRipple
                  >
                    <div>
                      <img
                        src={avatar}
                        className="w-14 rounded-full border "
                        alt="avatar"
                      />
                    </div>
                  </Button>
                )}
                {/* <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  disableTouchRipple
                >
                  <div>
                    <img
                      // src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg"
                      src={avatar}
                      className="rounded-full border w-12 h-12"
                      alt="avatar"
                    />
                  </div>
                </Button> */}
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <div className="px-4 text-sm ">
                    <div className="py-2">
                      <span className="text-lg font-medium text-[#081c36]">
                        {userName ? userName : localStorage.getItem("userName")}
                      </span>
                    </div>
                    <div className="w-[270px] border-y py-1 text-sm ">
                      <MenuItem
                        sx={{
                          fontSize: 14,
                          paddingLeft: 0,
                          height: 36,
                          color: "#081c36",
                        }}
                        onClick={handleOpenPopup}
                      >
                        Hồ sơ của bạn
                      </MenuItem>
                      <PopupWindow
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        data={JSON.parse(localStorage.getItem("user"))}
                        phoneNumber={localStorage.getItem("phone")}
                        token={cookies.get("token")}
                      />
                      <MenuItem
                        sx={{
                          fontSize: 14,
                          paddingLeft: 0,
                          height: 36,
                          color: "#081c36",
                        }}
                        onClick={handleClose}
                      >
                        Cài đặt
                      </MenuItem>
                    </div>
                    <Link to="/auth/login">
                      <MenuItem
                        sx={{
                          fontSize: 14,
                          paddingLeft: 0,
                          paddingTop: 1,
                          height: 36,
                          color: "#081c36",
                        }}
                        onClick={() => {
                          handleLogout();

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
                          // const cookieNames = ["phoneNumber", "token", "userID"];

                          // cookieNames?.forEach((cookieName) => {
                          //   cookies.remove(cookieName, {
                          //     path: "/",
                          //     domain: "localhost",
                          //   });
                          //   cookies.remove(cookieName, {
                          //     path: "/auth",
                          //     domain: "localhost",
                          //   });
                          // });

                          localStorage.clear();
                        }}
                      >
                        Đăng xuất
                      </MenuItem>
                    </Link>
                  </div>
                </Menu>
              </div>
            </li>

            <li>
              <Link
                to="/app"
                className={`flex justify-center p-4 py-5 ${location.pathname.startsWith("/app") ? "bg-[#006edc]" : ""
                  }`}
              >
                <img
                  src={messageImage}
                  className="h-[24px] w-[24px] items-center justify-center"
                  alt="avatar"
                />
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`flex justify-center p-4 py-5 ${location.pathname === "/contact" ? "bg-[#006edc]" : ""
                  }`}
              >
                <img
                  src={contactImage}
                  className="h-[24px] w-[24px]"
                  alt="avatar"
                />
              </Link>
            </li>
            <li>
              <Link
                to="/todo"
                className={`flex justify-center p-4 py-5 ${location.pathname === "/todo" ? "bg-[#006edc]" : ""
                  }`}
              >
                <img src={todoImage} className="h-[22px] w-[22px]" alt="avatar" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
