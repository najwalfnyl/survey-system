import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const SurveyStatusBox = () => {
    const [status, setStatus] = useState("Tanpa batasan");
    const [maxResponses, setMaxResponses] = useState(""); // State untuk jumlah responden
    const [startDate, setStartDate] = useState(""); // State untuk tanggal mulai
    const [endDate, setEndDate] = useState(""); // State untuk tanggal berakhir

    return (
        <AuthenticatedLayout>
            <Head title="Status Survey" />

            <div className="py-12 px-7">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="border-b pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Status</h3>
                        <p className="text-gray-600 text-sm">Decide your survey status will be:</p>
                    </div>

                    {/* Dropdown */}
                    <div className="mb-4 mt-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[25%] text-sm px-4 border rounded-sm text-gray-800"
                        >
                            <option value="Tanpa batasan">Tanpa batasan</option>
                            <option value="Terbatas">Dibatasi oleh waktu</option>
                            <option value="Private">Dibatasi oleh jumlah respon</option>
                        </select>
                    </div>

                    {/* Input Jumlah Responden - Muncul hanya jika "Private" dipilih */}
                    {status === "Private" && (
                        <div className="mb-4 flex items-center">
                            <div className="h-full p-2 bg-gray-200 text-gray-700 text-sm rounded-sm">
                                Jumlah responden
                            </div>
                            <input
                                type="number"
                                value={maxResponses}
                                onChange={(e) => setMaxResponses(e.target.value)}
                                className="p-2 w-[25%] text-sm border border-gray-200 rounded-sm text-gray-800"
                                placeholder="Masukkan jumlah responden"
                                min="1"
                            />
                        </div>
                    )}

                    {/* Input Tanggal - Muncul hanya jika "Dibatasi oleh waktu" dipilih */}
                    {status === "Terbatas" && (
                        <div className="mb-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-full p-2 bg-gray-200 text-gray-700 text-sm rounded-sm">
                                    Dari tanggal
                                </div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="p-2 text-sm border border-gray-200 rounded-sm text-gray-800"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-full p-2 bg-gray-200 text-gray-700 text-sm rounded-sm">
                                    Sampai tanggal
                                </div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 text-sm border border-gray-200 rounded-sm text-gray-800"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            className="bg-green-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-600"
                            onClick={() => router.visit('/collect-survey')}
                        >
                            Activate
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SurveyStatusBox;
