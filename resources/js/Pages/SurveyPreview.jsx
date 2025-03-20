import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import { useState } from "react";

export default function SurveyPreview({ auth }) {
    // State untuk menyimpan jawaban survey
    const [answers, setAnswers] = useState({
        question1: "",
        question2: "",
        question3: ""
    });

    // Handler untuk update jawaban
    const handleInputChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Survey Preview" />

           
            <div className="py-12 px-7">
                <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-4">Untitled</h1>

                    {/* Pertanyaan 1 - Pilihan Ganda */}
                    <div className="mb-4">
                        <p className="font-semibold">1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta eu diam sed pulvinar?</p>
                        <div className="mt-2 space-y-2">
                            {["London", "Edinburgh", "Liverpool", "Canary Wharf"].map((option) => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="question1"
                                        value={option}
                                        checked={answers.question1 === option}
                                        onChange={handleInputChange}
                                        className="w-5 h-5"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Pertanyaan 2 - Jawaban Singkat */}
                    <div className="mb-4">
                        <p className="font-semibold">2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta eu diam sed pulvinar?</p>
                        <input
                            type="text"
                            name="question2"
                            placeholder="Type your answer here..."
                            value={answers.question2}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 mt-2"
                        />
                    </div>

                    {/* Pertanyaan 3 - Skala Rating */}
                    <div className="mb-4">
                        <p className="font-semibold">3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta eu diam sed pulvinar?</p>
                        <div className="flex space-x-4 mt-2">
                            {[1, 2, 3].map((num) => (
                                <label key={num} className="flex flex-col items-center">
                                    <span>{num}</span>
                                    <input
                                        type="radio"
                                        name="question3"
                                        value={num}
                                        checked={answers.question3 === `${num}`}
                                        onChange={handleInputChange}
                                        className="w-6 h-6"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tombol DONE */}
                    <div className="text-center mt-6">
                    <Link
                    href={route('status-survey')} // Pastikan rute sesuai dengan web.php
                    className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 inline-block"
                    >
                    DONE
                    </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
