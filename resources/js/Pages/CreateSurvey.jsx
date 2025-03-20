import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import QuestionSection from "../Components/QuestionSection";
import axios from "axios";

export default function CreateSurvey({ survey }) {
    // State untuk menyimpan survey
    const [currentSurvey, setCurrentSurvey] = useState(survey);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(survey?.title || "UNTITLED"); 
    const [tempTitle, setTempTitle] = useState(title);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("draft");

    const handleEdit = () => {
        setTempTitle(title);
        setIsEditing(true);
    };

    const handleSave = async () => {
      setLoading(true);
  
      try {
          const response = await axios.post("/api/surveys", {
              name: tempTitle,
              status: "draft", // Tambahkan status agar sesuai dengan validasi backend
              user_id: 1 // Sesuaikan dengan sistem autentikasi
          });
  
          setCurrentSurvey(response.data.survey);
          console.log("Survey berhasil dibuat:", response.data.survey);
      } catch (error) {
          console.error("Gagal menyimpan survey:", error);
          if (error.response) {
              console.error("Response Data:", error.response.data);
              console.error("Status Code:", error.response.status);
          }
      } finally {
          setLoading(false);
      }
  };
  

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Survey" />

            <div className="py-12 px-7">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="border-b pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Create New Survey</h2>
                    </div>

                    {/* Title Section */}
                    <div className="flex justify-between items-center border-b pb-2 mt-2">
                        {isEditing ? (
                            <div className="w-full flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg text-gray-800"
                                />
                                <button 
                                    onClick={handleCancel} 
                                    className="text-sm text-gray-500 px-3 py-1 border rounded-lg"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    className="text-sm text-white bg-green-500 px-3 py-1 rounded-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                                <button 
                                    onClick={handleEdit} 
                                    className="text-sm text-gray-500 px-3 py-1 border rounded-lg"
                                    disabled={loading}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>

                    {/* Question Section */}
                    <QuestionSection />

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold ${
                                currentSurvey?.id 
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                            onClick={() => router.visit("/survey-preview")}
                            disabled={!currentSurvey?.id}
                        >
                            DONE
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
