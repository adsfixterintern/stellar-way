// @/components/admin-dashboard/FaqModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { question: string; answer: string }) => void;
  editData?: any;
}

export const FaqModal = ({ isOpen, onClose, onSubmit, editData }: FaqModalProps) => {
  
  const [formData, setFormData] = useState({
    question: editData?.question || "",
    answer: editData?.answer || ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-10 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 md:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black mb-8 uppercase tracking-tight text-gray-900 border-b pb-4">
          {editData ? "Update FAQ" : "New FAQ Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 block ml-1 tracking-widest">
              Question Label
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-5 text-sm font-bold transition-all outline-none"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              placeholder="e.g. What is Stellar Way?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 block ml-1 tracking-widest">
              Detailed Answer
            </label>
            <textarea 
              required 
              rows={5}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-5 text-sm font-bold transition-all outline-none resize-none"
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              placeholder="Provide a professional explanation..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#1A4E11] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {editData ? "Save Changes" : "Publish FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};