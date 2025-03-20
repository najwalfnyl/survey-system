import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const SurveyStatusBox = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Collect Response" />

            <div className="py-12 px-7">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="border-b pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Link</h3>
                        <p className="text-gray-600 text-sm">
                            Copy and paste this URL to share your survey in an email, on a website, or on social media. 
                            This kind of collector is open by default, and the link works until you close it.
                        </p>
                    </div>

                    {/* Link Box */}
                    <div className="bg-gray-200 p-3 rounded-sm text-sm flex items-center gap-3 mt-4 w-full">
                        <span className="text-xl">🔗</span>
                        <input 
                            type="text" 
                            value="https://www.surveyuns.com/r/26NMS2J" 
                            readOnly 
                            className="border border-gray-300 p-2 text-sm rounded-sm bg-white w-full text-gray-700"
                        />
                        <button className="border border-gray-300 text-sm  px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100">
                            Customize
                        </button>
                        <button className="border border-gray-300 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100">
                            Copy
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            className="bg-green-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-600"
                            onClick={() => router.visit('/analyze-survey')}
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
