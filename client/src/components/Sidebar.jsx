import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

  const {getUsers, users, selectedUser ,setSelectedUser,
    unseenMessages, setUnssenMessages } = useContext(ChatContext);
  

  const {logout, onlineUsers} = useContext(AuthContext)

  const [input, setInput] = useState(false)

  const navigate = useNavigate();

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().
  includes(input.toLowerCase())) : users;

  return (
    <div
      className={`bg-[#8185B5]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-[160px]" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <div
              className="absolute right-0 top-full rounded-md bg-[#282142] border
              border-gray-600 text-gray-100 hidden group-hover:block
              z-20 w-20 p-5 flex flex-col gap-2"
            >
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p onClick={()=> logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />

          <input onChange={(e)=>setInput(e.target.value)}
            type="text"
            placeholder="Search User..."
            className="bg-transparent text-white text-xs border-none outline-none placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>
      <div className='flex flex-col'>
        {filteredUsers.map((user,index)=>(
          <div onClick={()=> {setSelectedUser(user); setUnssenMessages(prev=>({
            ...prev, [user._id] : 0
          }))}}
          key={index} className={`relative flex item-center gap-2 p-2 pl-4
          rounded cursor-pointer max-sm:text-sm ${selectedUser?._id ===user.
          _id && 'bg-[#282142]/50'}`}>
            <img src={user?.profilePic || assets.avtar_icon} alt=""
            className='w-[35px] aspect-[1/1] rounded-full'/>
            <div>
              <p>{user.fullName}</p>
              {
                onlineUsers.includes(user._id)
                ? <span className='text-xs text-green-500'>Online</span>
                : <span className='text-xs text-gray-500'>Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5
            flex justify-center rounded-full bg-violet-500/50'>
            {unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
