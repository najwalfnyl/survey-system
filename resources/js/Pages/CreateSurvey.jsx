import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import QuestionSection from "../Components/QuestionSection";
import API, { setAuthToken } from "../services/api"; 
  

export default function CreateSurvey({ survey, token }) {
    const [currentSurvey, setCurrentSurvey] = useState(survey);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(survey?.title || "UNTITLED"); 
    const [tempTitle, setTempTitle] = useState(title);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("draft");
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }
      }, []);

    const handleEdit = () => {
        setTempTitle(title);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setLoading(true);
    
        try {
            const slug = tempTitle.toLowerCase().replace(/\s+/g, "-");
    
            if (!currentSurvey?.id) {
                // 🔹 Buat survey baru
                const response = await API.post("/surveys", {
                    title: tempTitle,
                    description: null,
                    slug,
                    status,
                    qr_code: null,
                });
    
                setCurrentSurvey(response.data.survey);
            } else {
                // 🔹 Update survey lama
                const response = await API.patch(`/surveys/${currentSurvey.id}/update-title`, {
                    title: tempTitle,
                });
    
                setCurrentSurvey(response.data.survey);
            }
    
            setTitle(tempTitle);
            setIsEditing(false);
            console.log("Survey berhasil disimpan:", tempTitle);
        } catch (error) {
            console.error("Gagal menyimpan survey:", error);
            if (error.response) {
                console.error("Response:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
      };  
      
      const handleDone = async () => {
        if (!currentSurvey?.id) return;
      
        try {
          const response = await API.post(`/surveys/${currentSurvey.id}/questions`, {
            questions: questions.map((q) => ({
                question_text: q.text,
                question_type: q.type,
                choices: q.choices || [],
                likertLabels: q.likertLabels || [],
                placeholder_text: q.placeholderText || ""
              }))              
          });
      
          console.log("Berhasil simpan pertanyaan!", response.data);
      
          // 🔽 Gunakan slug dari survey yang sudah tersimpan
          router.visit(`/survey-preview/${currentSurvey.slug}`);
        } catch (error) {
          console.error("Gagal simpan pertanyaan:", error.response?.data || error);
        }
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
                    <QuestionSection onQuestionsChange={setQuestions} />

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                    <button
    className={`px-6 py-2 rounded-lg font-semibold ${
        currentSurvey?.id 
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
    onClick={handleDone}
>
    DONE
</button>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
