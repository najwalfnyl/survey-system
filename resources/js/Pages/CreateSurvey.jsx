import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import QuestionSection from "../Components/QuestionSection";
import API, { setAuthToken } from "../services/api";

export default function CreateSurvey({ survey, token }) {
    const { survey: pageSurvey } = usePage().props;
    const fullLink = pageSurvey ? `http://127.0.0.1:8000/respond/${pageSurvey.slug}` : '';
    const [currentSurvey, setCurrentSurvey] = useState(survey);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(survey?.title || "UNTITLED");
    const [tempTitle, setTempTitle] = useState(title);
    const [status, setStatus] = useState(survey?.status || "draft");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
        }
    }, []);

    // Load pertanyaan dari backend
    useEffect(() => {
        if (!survey?.questions) return;

        const loadedQuestions = survey.questions.map((q) => ({
            id: q.id,
            text: q.question_text,
            type: q.question_type,
            choices: q.options?.map(opt => opt.option_text) || [],
            likertLabels: q.likert_scales?.map(s => s.scale_label) || [],
            entities: q.entities?.map(e => e.entity_name) || [],
            placeholderText: q.placeholder_text || "",
        }));

        setQuestions(loadedQuestions);
    }, [survey]);


    const handleCopy = () => {
        navigator.clipboard.writeText(fullLink);
        alert("Link copied to clipboard!");
    };

    const handleEdit = () => {
        setTempTitle(title);
        setStatus(currentSurvey?.status || "draft");
        setIsEditing(true);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const slug = tempTitle.toLowerCase().replace(/\s+/g, "-");

            if (!currentSurvey?.id) {
                const response = await API.post("/surveys", {
                    title: tempTitle,
                    description: null,
                    slug,
                    status,
                    qr_code: null,
                });
                setCurrentSurvey(response.data.survey);
            } else {
                const response = await API.patch(`/surveys/${currentSurvey.id}/update-title`, {
                    title: tempTitle,
                    status,
                });
                setCurrentSurvey(response.data.survey);
            }

            setTitle(tempTitle);
            setIsEditing(false);
        } catch (error) {
            console.error("Gagal menyimpan survei:", error.response?.data || error);
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
            router.visit(`/survey-preview/${currentSurvey.slug}`);
        } catch (error) {
            console.error("Gagal menyimpan pertanyaan:", error.response?.data || error);
        }
    };

    const handleSaveStatus = async () => {
        try {
            const response = await API.patch(`/status-survey/${currentSurvey.slug}/set-status`, {
                status,
            });
            setCurrentSurvey(response.data.survey);
            alert('Status updated successfully!');
        } catch (error) {
            console.error("Gagal menyimpan status:", error);
            alert('Failed to update status');
        }
    };

    const handleUpdateQuestions = async () => {
        if (!currentSurvey?.id) return;

        const hasEmptyText = questions.some((q) => !q.text || q.text.trim() === "");
        const hasInvalidType = questions.some((q) => q.type === "Choose Type");
        const hasLikertWithoutEntities = questions.some(
            (q) => q.type === "Likert Scale" && (!q.entities || q.entities.filter(e => e.trim() !== "").length === 0)
        );

        if (hasEmptyText) {
            alert("Semua pertanyaan harus memiliki teks.");
            return;
        }
        if (hasInvalidType) {
            alert("Ada pertanyaan yang belum dipilih tipenya.");
            return;
        }
        if (hasLikertWithoutEntities) {
            alert("Pertanyaan Likert Scale harus memiliki minimal 1 entitas.");
            return;
        }

        try {
            const response = await API.patch(`/surveys/${currentSurvey.id}/questions`, {
                questions: questions.map((q) => ({
                    id: q.id,
                    question_text: q.text,
                    question_type: q.type,
                    choices: (q.choices || []).filter(c => typeof c === "string" && c.trim() !== ""),
                    likertLabels: (q.likertLabels || []).filter(l => typeof l === "string" && l.trim() !== ""),
                    entities: (q.entities || []).filter(e => typeof e === "string" && e.trim() !== ""),
                    placeholder_text: q.placeholderText || "",
                })),
            });
            alert("Pertanyaan berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal update pertanyaan:", error.response?.data || error);
            alert("Gagal update pertanyaan.");
        }
    };


    return (
        <AuthenticatedLayout>
            <Head title="Create Survey" />
            <div className="py-12 px-7">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
                    <div className="border-b pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Create New Survey</h2>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2 mt-2">
                        {isEditing ? (
                            <div className="w-full flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg text-gray-800"
                                />
                                <button onClick={handleCancel} className="text-sm text-gray-500 px-3 py-1 border rounded-lg" disabled={loading}>Cancel</button>
                                <button onClick={handleSave} className="text-sm text-white bg-green-500 px-3 py-1 rounded-lg" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                                <button onClick={handleEdit} className="text-sm text-gray-500 px-3 py-1 border rounded-lg" disabled={loading}>Edit</button>
                            </>
                        )}
                    </div>

                    <QuestionSection initialQuestions={questions} onQuestionsChange={setQuestions} />

                    {currentSurvey?.id && fullLink && (
                        <div className="text-center mt-4">
                            <button onClick={handleUpdateQuestions} className="px-6 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600">
                                Update Pertanyaan
                            </button>
                        </div>
                    )}

                    {currentSurvey?.id && fullLink && (
                        <div className="bg-gray-200 p-3 rounded-sm text-sm items-center gap-3 mt-4 w-full">
                            <div className="w-3/4 mb-2 text-lg text-black-600 font-semibold">Link Akses Survey</div>
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-xl">🔗</span>
                                <input type="text" value={fullLink} readOnly className="border border-gray-300 p-2 text-sm rounded-sm bg-white w-full text-gray-700" />
                                <button onClick={handleCopy} className="border border-gray-300 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100">Copy</button>
                            </div>
                        </div>
                    )}

                    {currentSurvey?.id && fullLink && (
                        <div className="bg-gray-200 p-3 rounded-sm text-sm items-center gap-3 mt-4 w-full">
                            <div className="w-3/4 mb-2 text-lg text-black-600 font-semibold">Atur Status Survey</div>
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
                                <button onClick={handleSaveStatus} className="border border-gray-300 w-1/4 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100">Save Status</button>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        {(currentSurvey?.id && fullLink) ? (
                            <button
                                className="px-6 py-2 rounded-lg font-semibold bg-gray-500 text-white hover:bg-gray-600"
                                onClick={() => router.visit('/dashboard')} // Atau pakai window.history.back() kalau mau kembali ke halaman sebelumnya
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600"
                                onClick={handleDone}
                            >
                                DONE
                            </button>
                        )}
                    </div>


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
