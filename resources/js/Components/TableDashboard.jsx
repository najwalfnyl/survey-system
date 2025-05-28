import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

export default function TableDashboard() {
  const { surveys } = usePage().props;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSurveys = surveys.filter((survey) => {
    const matchSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || survey.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };

  const statusStyle = {
    draft: "bg-[#EAF6FA] text-[#0689FF]",
    open: "bg-[#D1FFD3] text-[#0B7E00]",
    closed: "bg-[#FFDBD9] text-[#F84B40]",
  };

  return (
    <div className="p-6">
      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-5">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Survey"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 h-10 text-sm rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute top-0 right-0 h-full flex items-center">
            <div className="bg-[#34495E] h-full px-3 flex items-center justify-center rounded-r-md">
              <img src="/assets/Search.svg" alt="Search" className="w-4 h-4 invert brightness-0" />
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative ml-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-52 h-10 text-sm px-4 pr-10 rounded-md border border-blue-500 bg-white shadow-sm appearance-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            <option value="all">Status: All</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>


          {/* Dropdown Icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
            <img src="/assets/Vector.svg" alt="dropdown" className="w-5 h-5" />
          </div>
        </div>
      </div>


      {/* Table */}
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
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey, index) => (
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
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="4">No surveys found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
