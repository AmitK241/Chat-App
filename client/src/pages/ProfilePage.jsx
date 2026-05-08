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
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">

      <div className="w-full max-w-2xl premium-card p-10
                      flex flex-col items-center gap-8 animate-fade-up">

        {/* Image preview at top */}
        <img
          className="w-32 h-32 rounded-full object-cover avatar-ring"
          src={selectedImg ? URL.createObjectURL(selectedImg) : assets.logo_icon}
          alt="logo"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

          <h3 className="text-2xl font-bold text-center text-[var(--text-white)] tracking-tight">
            Profile Details
          </h3>

          {/* Upload */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer group
                                            p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors">
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
              className={`w-12 h-12 object-cover opacity-60 group-hover:opacity-100 transition-opacity ${selectedImg && "rounded-full avatar-ring"}`}
            />

            <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-green)] transition-colors font-medium">
              Upload Profile Image
            </span>
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="premium-input"
          />

          {/* Bio */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Write profile bio"
            className="premium-input resize-none"
            required
          ></textarea>

          {/* Save button at bottom */}
          <button
            type="submit"
            className="btn-green py-3.5 cursor-pointer text-center"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Save Profile
          </button>
        </form>

        <img
          className={`max-w-44 aspect-square rounded-full avatar-ring max-sm:mt-6 ${selectedImg && "rounded-full"}`}
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
        />

      </div>
    </div>
  )
}

export default ProfilePage
