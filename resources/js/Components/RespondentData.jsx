import React from "react";
import { usePage } from "@inertiajs/react";

const RespondentData = () => {
  const { questions = [], responses = [] } = usePage().props;

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      {responses.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada data responden.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Input Date</th>
              <th className="border px-4 py-2">Input Time</th>
              {questions.map((q, idx) => (
                <th key={q.id} className="border px-4 py-2">{`Q${idx + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((row) => (
              <tr key={row.id} className="text-center">
                <td className="border px-4 py-2">{row.index}</td>
                <td className="border px-4 py-2">{row.date}</td>
                <td className="border px-4 py-2">{row.time}</td>
                {questions.map((q) => (
                  <td key={q.id} className="border px-4 py-2">
                    {row.answers[q.id] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RespondentData;
