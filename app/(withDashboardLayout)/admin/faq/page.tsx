/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useFaqs } from "@/app/hooks/useFaqs";
import { createFaq, updateFaq, deleteFaq } from "@/app/modules/faq/faq.api";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Trash2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { FaqModal } from "@/components/admin-dashboard/FaqModal";
import Swal from "sweetalert2";
import { SkeletonFAQ } from "@/components/shared/SkeletonFAQ";

export default function FaqManagementPage() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useFaqs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any | null>(null);


  const handleAction = async (formData: { question: string; answer: string }) => {
    const toastId = toast.loading(selectedFaq ? "Updating..." : "Creating...");
    try {
      if (selectedFaq) {
        await updateFaq(selectedFaq._id, formData);
        toast.success("FAQ Updated Successfully", { id: toastId });
      } else {
        await createFaq(formData);
        toast.success("FAQ Created Successfully", { id: toastId });
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    } catch (err) {
        console.log(err);
      toast.error("Operation Failed", { id: toastId });
    }
  };


  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11", 
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      customClass: {
        popup: "rounded-[32px] font-sans",
        confirmButton: "rounded-xl px-6 py-3 font-bold uppercase text-[12px] tracking-widest",
        cancelButton: "rounded-xl px-6 py-3 font-bold uppercase text-[12px] tracking-widest"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFaq(id);
          Swal.fire({
            title: "Deleted!",
            text: "The FAQ has been removed.",
            icon: "success",
            confirmButtonColor: "#1A4E11",
            customClass: { popup: "rounded-[32px]" }
          });
          queryClient.invalidateQueries({ queryKey: ["faqs"] });
        } catch (err) {
            console.log(err);
          toast.error("Delete Failed");
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8F9FA] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
              Help Center <HelpCircle className="text-indigo-600 fill-indigo-50" size={28} />
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] mt-2">Manage Professional Knowledge Base</p>
          </div>
          <button 
            onClick={() => { setSelectedFaq(null); setIsModalOpen(true); }}
            className="blockBtn"
          >
            <Plus size={18} strokeWidth={3} /> New Entry
          </button>
        </div>

   
        {isLoading ? (
          <SkeletonFAQ></SkeletonFAQ>
        ) : (
          <div className="grid gap-4">
            {faqs.length > 0 ? faqs.map((faq: any) => (
              <div key={faq._id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">{faq.question}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium pl-5 border-l-2 border-gray-50 ml-1">
                    {faq.answer}
                  </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto shrink-0 border-t md:border-none pt-4 md:pt-0">
                  <button 
                    onClick={() => { setSelectedFaq(faq); setIsModalOpen(true); }}
                    className="flex-1 md:flex-none p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(faq._id)}
                    className="flex-1 md:flex-none p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                 <HelpCircle size={48} className="mx-auto text-gray-100 mb-4" />
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No FAQs found in database</p>
              </div>
            )}
          </div>
        )}
      </div>

      <FaqModal 
        key={selectedFaq?._id || "new-faq"}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAction}
        editData={selectedFaq}
      />
    </div>
  );
}