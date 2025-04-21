import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

const CollectResponse = () => {
    const { survey } = usePage().props;
    const fullLink = `http://127.0.0.1:8000/respond/${survey.slug}`;

    const slug = survey.slug; // ← Tambahkan baris ini


    const handleCopy = () => {
        navigator.clipboard.writeText(fullLink);
        alert("Link copied to clipboard!");
    };

    const handleActivate = async () => {
        try {
            await axios.post(`/status-survey/${slug}/set-status`, {
                status: "open", // yang utama
                status_mode: "Tanpa batasan", // opsional
                max_responses: null,
                start_date: null,
                end_date: null,
              });
              

              router.visit(route('analyze-survey.show', slug));
// pastikan ada named route di Laravel
        } catch (error) {
            console.error("Gagal activate survey:", error);
            alert("Gagal mengaktifkan survei.");
        }
    };

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
                            value={fullLink}
                            readOnly
                            className="border border-gray-300 p-2 text-sm rounded-sm bg-white w-full text-gray-700"
                        />
                        <button className="border border-gray-300 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100">
                            Customize
                        </button>
                        <button
                            onClick={handleCopy}
                            className="border border-gray-300 text-sm px-4 py-2 rounded-sm bg-white text-gray-700 hover:bg-gray-100"
                        >
                            Copy
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            onClick={handleActivate}
                            className="bg-green-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-600"
                        >
                            Activate
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CollectResponse;
