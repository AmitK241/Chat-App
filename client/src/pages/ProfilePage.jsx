import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat p-4">

      <div className="w-full max-w-2xl backdrop-blur-2xl text-gray-300 
                      border border-gray-600 rounded-xl p-8 
                      flex flex-col items-center gap-8">

        {/* Image preview at top */}
        <img
          className="w-32 h-32 rounded-full object-cover border border-gray-500"
          src={selectedImg ? URL.createObjectURL(selectedImg) : assets.logo_icon}
          alt="logo"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

          <h3 className="text-xl font-semibold text-center">Profile Details</h3>

          {/* Upload */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt=""
              className={`w-12 h-12 object-cover ${selectedImg && "rounded-full"}`}
            />

            <span>Upload Profile Image</span>
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Write profile bio"
            className="p-2 border border-gray-500 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          ></textarea>

          {/* Save button at bottom */}
          <button
            type="submit"
            className="bg-gradient-to-tr from-purple-400 to-violet-600 
                       text-white py-2 rounded-full text-lg cursor-pointer
                       hover:opacity-90 transition"
          >
            Save
          </button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full max-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`} src={authUser?.profilePic || assets.logo_icon} alt="" />

      </div>
    </div>
  )
}

export default ProfilePage
