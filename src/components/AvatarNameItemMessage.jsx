import { formatDistanceToNow } from "date-fns";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
function AvatarNameItemMessage({
  item,
  chatName,
  setConversation,
  setMessageIDRef,
}) {
  console.log("item", item);
  const cookies = new Cookies();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = queryString.parse(location.search);
  const unreadCount = 1;

  function formatTimeDifference(timestamp) {
    const currentDate = new Date();
    // console.log(currentDate);
    const parsedTimestamp = new Date(timestamp);
    // console.log(parsedTimestamp);

    const minutesDifference = differenceInMinutes(currentDate, parsedTimestamp);

    if (minutesDifference < 1) {
      return `${Math.floor(minutesDifference * 60)} giây`;
    }

    const hoursDifference = differenceInHours(currentDate, parsedTimestamp);

    if (hoursDifference < 1) {
      return `${Math.floor(minutesDifference)} phút`;
    }

    const daysDifference = differenceInDays(currentDate, parsedTimestamp);

    if (daysDifference < 1) {
      return `${Math.floor(hoursDifference)} giờ`;
    }

    const monthsDifference = differenceInMonths(currentDate, parsedTimestamp);

    if (monthsDifference < 1) {
      return `${Math.floor(daysDifference)} ngày`;
    }

    const yearsDifference = differenceInYears(currentDate, parsedTimestamp);

    return `${Math.floor(monthsDifference)} tháng`;
  }

  const timestamp = item.timestamp;
  const originalDate = new Date(timestamp);
  // Trừ 7 giờ
  const adjustedDate = new Date(originalDate.getTime() - 7 * 60 * 60 * 1000);
  const timeDifference = formatTimeDifference(adjustedDate);

  const [tokenFromCookies, setTokenFromCookies] = useState("");

  const handleSetMessagesInConversation = () => {
    const tokenFromCookie = cookies.get("token");
    console.table(id, item.messageID);
    const fetchConversation = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_HOST}/api/v1/chat/get-search?chatID=${id}&messageID=${item.messageID}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenFromCookie,
            },
            method: "GET",
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
          throw new Error("Failed to search message in conversations");
        }
        const data = await response.json();
        setConversation(data);
        setMessageIDRef(item.messageID);
        // console.log("Conversation>>>>>>>>>>>:", data);
      } catch (error) {
        console.error("Error fetching search message in conversations:", error);
      }
    };
    if (item.messageID && id && tokenFromCookie) fetchConversation();
  };

  return (
    <>
      <div
        className={`flex h-[68px] w-full items-center pr-2 ${
          // countTopChatActivity <= 10 ? "pr-1" : ""
          "pr-1"
          } cursor-pointer pl-3 hover:bg-[#F0F2F5]`}
        onClick={() => {
          // console.log("Clicked");
          handleSetMessagesInConversation();
        }}
      >
        {/* <img
            src={chatAvatar}
            alt="avatar"
            className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
          /> */}
        <Avatar
          // alt="avatar"
          src={item.userAvatar}
          sx={{ width: 40, height: 40 }}
        />
        <div
          className="flex grow justify-between pl-3 md:w-[342px]"
          id="content"
        >
          <div className="">
            {unreadCount !== 0 ? (
              <>
                <div className="grid gap-y-1">
                  <div>
                    <span className="text-sm font-semibold text-[#081C36]">
                      {item.userID === localStorage.getItem("userID")
                        ? localStorage.getItem("userName")
                        : chatName}
                    </span>
                  </div>
                  <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                    <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-sm md:w-[175px]">
                      {/* {messageContent} */}
                      {/* {newMessage} */}
                      {item.contents[0].value}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-y-1">
                  <div>
                    <span className="text-base font-semibold text-[#081C36]">
                      {item.userID}
                    </span>
                  </div>
                  <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                    <span>Bạn:&nbsp;</span>
                    <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                      {item.contents[0].value}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-[-4px] grid gap-y-1 ">
            <div>
              <span className="truncate text-xs">{timeDifference}</span>
            </div>
            {unreadCount !== 0 ? (
              <>
                {/* <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                  <span className="text-xs">{unreadCount}</span>
                </div> */}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AvatarNameItemMessage;
