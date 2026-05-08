import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Extract images from messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className="text-white w-full relative overflow-y-scroll max-md:hidden p-6"
      style={{ background: 'var(--bg-card)' }}
    >

      {/* Profile Section */}
      <div className="pt-8 flex flex-col items-center gap-4">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 h-20 rounded-full object-cover avatar-ring"
        />

        <div className="text-center">
          <h1 className="text-lg font-bold text-[var(--text-white)] flex items-center justify-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="online-dot"></span>
            )}
          </h1>

          <p className="text-[var(--text-muted)] text-xs mt-2 leading-relaxed px-2">
            {selectedUser.bio}
          </p>
        </div>
      </div>

      <hr className="premium-divider my-6" />

      {/* Shared Media Section */}
      <div>
        <p className="text-xs font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-3">
          Shared Media
        </p>

        <div className="max-h-[200px] overflow-y-auto grid grid-cols-3 gap-2">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url, "_blank")}
              className="cursor-pointer overflow-hidden border border-[var(--border-subtle)]
                         hover:border-[var(--border-green)] transition-all"
              style={{ borderRadius: 'var(--radius-xs)' }}
            >
              <img src={url} alt="" className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="btn-outline w-full mt-6 py-2.5 text-sm cursor-pointer"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
