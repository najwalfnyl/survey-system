import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SummeryAnalyze from "../Components/SummeryAnalyze";
import RespondentData from "../Components/RespondentData";
import LikertData from "../Components/LikertData";
import { router } from "@inertiajs/react";
import { Head, usePage } from "@inertiajs/react";
import { route } from 'ziggy-js';

const SurveyPage = () => {
    const { survey } = usePage().props;
    const slug = survey.slug;
    const [activeTab, setActiveTab] = useState("summary");

    return (
        <AuthenticatedLayout>
            <Head title="Survey Analysis" />
            <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{survey.title}</h3>
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => window.open(`/survey/${slug}/export`, '_blank')}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md"
                    >
                        Export Data
                    </button>

                    {/* 
  <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
    Shared Data
  </button>
*/}

                    <span className="text-gray-700">RESPONDENTS: 0 of 0</span>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${activeTab === "summary"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("summary")}
                        >
                            Summary
                        </button>
                        <button
                            className={`px-4 py-2 ml-4 ${activeTab === "respondent"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("respondent")}
                        >
                            Respondent Data
                        </button>
                        <button
                            className={`px-4 py-2 ml-4 ${activeTab === "likert"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("likert")}
                        >
                            Likert Data
                        </button>
                    </div>

                    {activeTab === "summary" && <SummeryAnalyze slug={slug} />}
                    {activeTab === "respondent" && <RespondentData slug={slug} />}
                    {activeTab === "likert" && <LikertData slug={slug} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SurveyPage;
