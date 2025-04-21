import React from "react";

export default function SummaryCards({ totalSurveys, totalDraft, totalOpen, totalResponses }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-md text-center">
        <h4 className="text-gray-500 text-sm">Total Surveys</h4>
        <p className="text-2xl font-bold text-blue-600">{totalSurveys}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md text-center">
        <h4 className="text-gray-500 text-sm">Draft</h4>
        <p className="text-2xl font-bold text-yellow-500">{totalDraft}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md text-center">
        <h4 className="text-gray-500 text-sm">Open</h4>
        <p className="text-2xl font-bold text-green-500">{totalOpen}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md text-center">
        <h4 className="text-gray-500 text-sm">Total Responses</h4>
        <p className="text-2xl font-bold text-purple-600">{totalResponses}</p>
      </div>
    </div>
  );
}
