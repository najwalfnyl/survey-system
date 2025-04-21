import React from "react";
import { usePage, router } from "@inertiajs/react";

export default function SurveyTable() {
  const { surveys } = usePage().props;

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };

  const statusStyle = {
    draft: "bg-[#EAF6FA] text-[#0689FF]",
    open: "bg-[#D1FFD3] text-[#0B7E00]",
    close: "bg-[#FFDBD9] text-[#F84B40]",
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">Date Updated</th>
              <th className="p-4">Survey Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">{formatDate(survey.updated_at)}</td>
                <td className="p-4 font-semibold">{survey.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusStyle[survey.status]}`}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => router.visit(route('survey.edit', survey.slug))}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Edit Survey
                  </button>
                  <button
                    onClick={() => router.visit(`/analyze-survey/${survey.slug}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
