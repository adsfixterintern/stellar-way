"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoCameraOutline,
  IoShieldCheckmarkOutline,
  IoSaveOutline,
  IoCloseOutline
} from "react-icons/io5";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const BASE_URL = "http://localhost:8000/api/v1/auth"; 
  
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user.id;
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // ফর্ম এবং ইমেজ স্টেট
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [image, setImage] = useState(""); // ব্যাকএন্ডে পাঠানোর জন্য Base64 String
  const [imagePreview, setImagePreview] = useState(""); // দেখানোর জন্য URL

  // ১. প্রোফাইল ডাটা ফেচ করা
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/me?userId=${userId}`);      
      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
        });
        setImagePreview(data.data.image || "");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        toast.error("Please login to access your profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

  
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large! Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);       
      }
    };
    reader.readAsDataURL(file);
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);

    
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        userId: userId, 
        image: image    
      };

      const { data } = await axios.patch(
        `${BASE_URL}/update-profile`,
        updateData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Profile Updated Successfully!");
        setUser(data.data);
        setIsEditing(false);
        setImage(""); // স্টেট রিসেট
      }
    } catch (err) {
      // ৪১৩ এরর হ্যান্ডেল করার জন্য মেসেজ
      if (err.response?.status === 413) {
        toast.error("Image is too large for the server. Try a smaller one.");
      } else {
        toast.error(err.response?.data?.message || "Update failed!");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-gray-400 font-sans">Loading Account...</p>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Account Settings</h1>
            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px] flex items-center gap-2">
              <IoShieldCheckmarkOutline className="text-[#1A4E11]" /> Manage your personal identity
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              if(isEditing) fetchProfile(); 
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
              isEditing ? "bg-red-50 text-red-500" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            {isEditing ? <><IoCloseOutline size={18}/> Cancel Edit</> : <><IoPersonOutline size={16}/> Edit Details</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Avatar Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
               
               <div className="relative inline-block group mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100  mx-auto flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#1A4E11]/20">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <label 
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 bg-[#1A4E11] p-2 rounded-full text-white cursor-pointer  hover:scale-110 transition-transform"
                    >
                      <IoCameraOutline size={20} />
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
               </div>

               <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{user?.name}</h2>
               <span className="inline-block px-3 py-1 bg-[#1A4E11]/10 text-[#1A4E11] text-[9px] font-black uppercase rounded-full mt-2 tracking-widest">
                 {user?.role || 'Member'}
               </span>

               <div className="mt-8 pt-6 border-t border-gray-50 space-y-4 text-left">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Email Address</p>
                    <p className="text-xs font-bold text-gray-700 truncate">{user?.email}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-10 rounded-[30px] border border-gray-100 ">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-800 outline-none focus:border-[#1A4E11] focus:bg-white transition-all disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
                    <div className="relative">
                      <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-800 outline-none focus:border-[#1A4E11] focus:bg-white transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Official Email</label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="email"
                      readOnly
                      value={user?.email || ""}
                      className="w-full bg-gray-100/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-300 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-gray-50">
                    <button 
                      type="submit"
                      disabled={updateLoading}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#143d0d] transition-all shadow-xl shadow-[#1A4E11]/20 disabled:opacity-70"
                    >
                      {updateLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><IoSaveOutline size={18}/> Update Account</>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;