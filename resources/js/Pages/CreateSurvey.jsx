import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import QuestionSection from "../Components/QuestionSection";
import API, { setAuthToken } from "../services/api";

export default function CreateSurvey({ survey, token }) {
    const { survey: pageSurvey } = usePage().props;
    const fullLink = pageSurvey ? `http://127.0.0.1:8000/respond/${pageSurvey.slug}` : ''; // Fallback jika pageSurvey belum ada
    const [currentSurvey, setCurrentSurvey] = useState(survey);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(survey?.title || "UNTITLED");
    const [tempTitle, setTempTitle] = useState(title);
    const [status, setStatus] = useState(survey?.status || "draft"); // Menambahkan status ke state
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(fullLink);
        alert("Link copied to clipboard!");
    };

    const handleEdit = () => {
        setTempTitle(title);
        setStatus(currentSurvey?.status || "draft"); // Set status saat mulai edit
        setIsEditing(true);
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            const slug = tempTitle.toLowerCase().replace(/\s+/g, "-");

            if (!currentSurvey?.id) {
                // Buat survei baru
                const response = await API.post("/surveys", {
                    title: tempTitle,
                    description: null,
                    slug,
                    status,
                    qr_code: null,
                });

                setCurrentSurvey(response.data.survey);
            } else {
                // Update survei lama
                const response = await API.patch(`/surveys/${currentSurvey.id}/update-title`, {
                    title: tempTitle,
                    status, // Pastikan status diperbarui
                });

                setCurrentSurvey(response.data.survey);
            }

            setTitle(tempTitle);
            setIsEditing(false);
            console.log("Survey berhasil disimpan:", tempTitle);
        } catch (error) {
            console.error("Gagal menyimpan survei:", error);
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
                    entities: q.entities || [],
                    placeholder_text: q.placeholderText || "",
                })),
            });

            console.log("Berhasil menyimpan pertanyaan!", response.data);

            // Redirect ke halaman preview survei
            router.visit(`/survey-preview/${currentSurvey.slug}`);
        } catch (error) {
            console.error("Gagal menyimpan pertanyaan:", error.response?.data || error);
        }
    };

    // Fungsi untuk menyimpan perubahan status
    const handleSaveStatus = async () => {
        try {
            const response = await API.patch(`/status-survey/${currentSurvey.slug}/set-status`, {
                status, // Status yang akan diperbarui
            });


            // Update survei setelah status disimpan
            setCurrentSurvey(response.data.survey);
            alert('Status updated successfully!');
        } catch (error) {
            console.error("Gagal menyimpan status:", error);
            alert('Failed to update status');
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

                    {/* Full Link (Only shown if survey has an ID, i.e. after creation or editing) */}
                    {currentSurvey?.id && fullLink && (
                        <div className="bg-gray-200 p-3 rounded-sm text-sm items-center gap-3 mt-4 w-full">
                            {/* Teks Penjelasan */}
                            <div className="w-3/4 mb-2 text-lg text-black-600 font-semibold">
                                Link Akses Survey
                            </div>
                            {/* Icon dan Link */}
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-xl">🔗</span>
                                <input
                                    type="text"
                                    value={fullLink}
                                    readOnly
                                    className="border border-gray-300 p-2 text-sm rounded-sm bg-white w-full text-gray-700"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="border border-gray-300 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status Section */}
                    {currentSurvey?.id && fullLink && (
                        <div className="bg-gray-200 p-3 rounded-sm text-sm items-center gap-3 mt-4 w-full">
                             <div className="w-3/4 mb-2 text-lg text-black-600 font-semibold">
                                Atur Status Survey
                            </div>
                             <div className="flex items-center gap-3 w-full">
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button
                                   onClick={handleSaveStatus} // Menambahkan tombol untuk menyimpan status
                                className="border border-gray-300 w-1/4 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100"
                            >
                                Save Status
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold ${currentSurvey?.id
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
