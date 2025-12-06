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
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden p-5">

      {/* Profile Section */}
      <div className="pt-10 flex flex-col items-center gap-3 text-sm font-light">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 h-20 rounded-full shadow-lg border border-white/10"
        />

        <h1 className="text-xl font-medium flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser.fullName}
        </h1>

        <p className="text-center opacity-80 px-4">{selectedUser.bio}</p>
      </div>

      <hr className="border-white/20 my-5" />

      {/* Shared Media Section */}
      <div>
        <p className="text-sm font-medium opacity-90 mb-2">Shared Media</p>

        <div className="max-h-[200px] overflow-y-auto grid grid-cols-3 gap-3 pr-2">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url, "_blank")}
              className="cursor-pointer rounded overflow-hidden border border-white/10 hover:border-white/40 transition"
            >
              <img src={url} alt="" className="w-full h-24 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full mt-5 bg-gradient-to-r from-purple-600 to-indigo-600 
                   py-2 rounded-full text-white text-sm font-medium shadow-lg 
                   hover:shadow-xl hover:from-purple-500 hover:to-indigo-500 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;

