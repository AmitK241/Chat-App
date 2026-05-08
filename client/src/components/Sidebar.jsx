import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

  const {getUsers, users, selectedUser ,setSelectedUser,
    unseenMessages, setUnseenMessages } = useContext(ChatContext);
  

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
      className={`h-full p-5 overflow-y-scroll border-r border-[var(--border-subtle)] ${
        selectedUser ? "max-md:hidden" : ""
      }`}
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-[140px]" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer invert opacity-40 hover:opacity-80 transition-opacity"
            />

            {/* Dropdown — glass-float for floating element */}
            <div
              className="glass-float absolute right-0 top-full
              text-gray-100 hidden group-hover:block
              z-20 w-36 p-4 flex flex-col gap-3"
              style={{ borderRadius: 'var(--radius-xs)' }}
            >
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-green)] transition-colors font-medium"
              >
                Edit Profile
              </p>

              <hr className="premium-divider" />

              <p onClick={()=> logout()} className="cursor-pointer text-sm text-[var(--text-secondary)] hover:text-red-400 transition-colors font-medium">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flat-surface flex items-center gap-3 py-3 px-4 mt-5"
             style={{ borderRadius: 'var(--radius-sm)' }}>
          <img src={assets.search_icon} alt="search" className="w-3.5 invert opacity-30" />

          <input onChange={(e)=>setInput(e.target.value)}
            type="text"
            placeholder="Search contacts..."
            className="bg-transparent text-[var(--text-primary)] text-sm border-none outline-none placeholder-[var(--text-muted)] flex-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>

      {/* User List */}
      <div className='flex flex-col gap-1'>
        {filteredUsers.map((user,index)=>(
          <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=>({
            ...prev, [user._id] : 0
          }))}}
          key={index} className={`relative flex items-center gap-3 p-3 pl-4
          cursor-pointer user-item ${selectedUser?._id ===user.
          _id && 'user-item-active'}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt=""
            className='w-[40px] aspect-[1/1] rounded-full'/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {
                  onlineUsers.includes(user._id)
                  ? <>
                      <span className='online-dot' style={{ width: '6px', height: '6px' }}></span>
                      <span className='text-xs text-[var(--text-green)] font-medium'>Online</span>
                    </>
                  : <span className='text-xs text-[var(--text-muted)]'>Offline</span>
                }
              </div>
            </div>
            {unseenMessages[user._id] > 0 && <p className='absolute top-3 right-3 h-5 w-5
            flex items-center justify-center unseen-badge'>
            {unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
