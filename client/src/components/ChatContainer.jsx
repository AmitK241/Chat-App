import React, { useContext, useState, useEffect, useRef } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div
      className="h-full overflow-y-scroll relative border-r border-[var(--border-subtle)]"
      style={{ background: 'var(--bg-black)' }}
    >
      {/* Chat Header */}
      <div className="flex items-center gap-3 py-4 mx-5 border-b border-[var(--border-subtle)]">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-9 h-9 rounded-full object-cover"
          alt=""
        />

        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--text-white)]">
            {selectedUser.fullName}
          </p>
          <div className="flex items-center gap-1.5">
            {onlineUsers.includes(selectedUser._id) ? (
              <>
                <span className="online-dot" style={{ width: '6px', height: '6px' }}></span>
                <span className="text-xs text-[var(--text-green)] font-medium">Online</span>
              </>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">Offline</span>
            )}
          </div>
        </div>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer invert opacity-40"
          alt=""
        />

        <img src={assets.help_icon} className="max-md:hidden max-w-5 opacity-30 hover:opacity-60 transition-opacity cursor-pointer" alt="" />
      </div>

      {/* Messages Area */}
      <div className="flex flex-col h-[calc(100%-130px)] overflow-y-scroll p-4 pb-6">
        {messages.map((msg, index) => {
          const isSent = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-6 ${
                isSent ? "justify-end" : "flex-row-reverse"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] rounded-2xl border border-[var(--border-subtle)]"
                />
              ) : (
                <p
                  className={`py-2.5 px-4 max-w-[260px] text-sm font-normal break-all ${
                    isSent
                      ? "msg-sent rounded-t-2xl rounded-bl-2xl rounded-br-md"
                      : "msg-received rounded-t-2xl rounded-br-2xl rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs flex flex-col items-center gap-1">
                <img
                  src={
                    isSent
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  className="w-6 h-6 rounded-full object-cover"
                  alt=""
                />
                <p className="text-[var(--text-muted)] text-[0.6rem] font-medium">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4"
           style={{ background: 'var(--bg-card)' }}>
        <div className="flex-1 flex items-center flat-surface px-4"
             style={{ borderRadius: 'var(--radius-xl)' }}>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Type a message..."
            className="bg-transparent py-3 flex-1 outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-1 cursor-pointer opacity-30 hover:opacity-70 transition-opacity"
              alt=""
            />
          </label>
        </div>

        <button
          onClick={handleSendMessage}
          className="btn-green w-11 h-11 flex items-center justify-center cursor-pointer p-0"
          style={{ borderRadius: '50%', padding: 0, minWidth: '44px' }}
        >
          <img
            src={assets.send_button}
            className="w-4.5"
            alt="Send"
          />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 border-r border-[var(--border-subtle)]"
         style={{ background: 'var(--bg-black)' }}>
      <img src={assets.logo_icon} className="max-w-16 opacity-60" alt="" />
      <div className="text-center">
        <p className="text-lg font-bold text-[var(--text-white)]">
          Chat anytime, anywhere
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">Select a conversation to get started</p>
      </div>
    </div>
  );
};

export default ChatContainer;
