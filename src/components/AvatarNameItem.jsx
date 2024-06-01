import React from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default function AvatarNameItem({ data, setData, type, handleClose, messageApi, contextHolder }) {
  const defaultText = `Xin chào! Mình tìm thấy bạn bằng số điện thoại. Kết bạn với mình nhé!`;
  const conversation = JSON.parse(localStorage.getItem("conversations"));
  const [type, setType] = useState("");
  const [conversationFriend, setConversationFriend] = useState([]);

  console.log(conversation)
  useEffect(() => {
    const filteredConversations = conversation?.filter(
      (chat) => chat.id_UserOrGroup === data.userID,
    );
    console.log("filteredConversations", filteredConversations);
    setConversationFriend(filteredConversations);
    if (filteredConversations?.length > 0) {
      setType(filteredConversations[0].type);
    }
  }, [data]);
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Kết bạn thành công",
    });
  };
  const handleAddSuggestedFriend = (friend) => {
    console.log(friend)
    console.log(`Add suggested friend: ${friend}`);
    const receiverID = friend.userID;
    const message = {
      id: uuidv4(),
      tum: "TUM01",
      senderID: Cookies.get("userID"),
      senderName: localStorage.getItem("userName"),
      senderAvatar: localStorage.getItem("avatar"),
      receiverID: receiverID,
      receiverName: data.userName,
      receiverAvatar: data.avatar,
      description: defaultText,
    };

    if (friend) {
      const newSocket = new WebSocket(
        `${process.env.REACT_APP_SOCKET_CHAT}/ws/user/${receiverID}`,
      );

      newSocket.onopen = () => {
        console.warn(
          `WebSocket ${process.env.REACT_APP_SOCKET_CHAT}/ws/user/' for UserID: `,
          receiverID,
          " OPENED",
        );


        newSocket.send(JSON.stringify(message));
        console.log("Message sent:", message);
      };

      newSocket.onmessage = (event) => {
        console.log("Message received:", event.data);
      };

      newSocket.onclose = () => {
        console.warn(
          `WebSocket '${process.env.REACT_APP_SOCKET_CHAT}/ws/user/' for UserID: `,
          receiverID,
          " CLOSED",
        );
      };
    }
  };
  return (
    <div
      className={`group flex h-[70px] w-full items-center pr-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-100`}
    >
      <img
        src={data.avatar}
        alt="avatar"
        className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
      />
      <div className="flex grow justify-between pl-3 md:w-[342px]" id="content">
        <div className="">
          <>
            <div className="grid gap-y-1">
              <div>
                {type === "AF" && (
                  <span className="text-base text-[#081C36]">
                    {data.name}
                  </span>
                )}
                {type === "MS" && (
                  <span className="text-base font-semibold text-[#081C36]">
                    {data.userName}
                  </span>
                )}
              </div>
              <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                {type === "AF" && (
                  <span className="text-xs font-light text-[#7589A3]">
                    {data.phoneNumber}
                  </span>
                )}
                {type === "MS" && (
                  <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-xs font-normal text-[#7589A3] md:w-[175px]">
                    Từ gợi ý kết bạn
                  </span>
                )}
              </div>
            </div>
          </>
        </div>
        <div className="mt-[-4px] grid items-center justify-center gap-y-1">
          <div className="align-center flex-1 justify-center">
            {type === "AF" && (
              <div className="flex h-full items-center justify-center">
                <span
                  className="truncate text-lg"
                  style={{ cursor: "pointer" }}
                >
                  &times;
                </span>
              </div>
            )}
            {type === "MS" && (
              <Button
                onClick={() => {
                  handleAddSuggestedFriend(data);
                  success();
                  handleClose()
                  setData((prevItems) => prevItems.filter(item => item.userID !== data.userID));
                }
                }
                variant="outlined"
                size="small"
                style={{
                  textTransform: "none",
                  color: "#0068FF",
                  fontSize: 14,
                  width: 84,
                  height: 24,
                  fontWeight: 500,
                }}
              >
                Kết bạn
              </Button>
            )}
          </div>
          {/* {1 !== 0 ? (
            <>
              <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                <span className="text-xs">1</span>
              </div>
            </>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </div>
  );
}
