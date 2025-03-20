import React from "react";

const surveys = [
  { date: "January 22, 2025", title: "Lorem ipsum dolor sit amet,", status: "Draft", statusColor: "bg-[#EAF6FA] text-[#0689FF]", },
  { date: "January 10, 2025", title: "Lorem ipsum dolor sit amet,", status: "Open", statusColor: "bg-[#D1FFD3] text-[#0B7E00]", },
  { date: "December 22, 2024", title: "Lorem ipsum dolor sit amet,", status: "Close", statusColor: "bg-[#FFDBD9] text-[#F84B40]", },
  { date: "December 11, 2024", title: "Lorem ipsum dolor sit amet,", status: "Draft", statusColor: "bg-[#EAF6FA] text-[#0689FF]", },
  { date: "December 05, 2024", title: "Lorem ipsum dolor sit amet,", status: "Open", statusColor: "bg-[#D1FFD3] text-[#0B7E00]", },
];

export default function SurveyTable() {
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
                <td className="p-4">{survey.date}</td>
                <td className="p-4 font-semibold">{survey.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${survey.statusColor}`}>
                    {survey.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Edit Survey</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Analyze</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
