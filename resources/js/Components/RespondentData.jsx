import React, { useEffect, useState } from "react";
import axios from "axios";

const RespondentData = ({ slug }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get(`/survey/${slug}/respondents`)
      .then(res => {
        setQuestions(res.data.questions);
        setResponses(res.data.responses);
      })
      .catch(console.error);
  }, [slug]);

  if (responses.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Belum ada data responden.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
            <th className="border px-4 py-2 sticky left-0 bg-gray-100 z-10">#</th>
            <th className="border px-4 py-2">Input Date</th>
            <th className="border px-4 py-2">Input Time</th>
            {questions.map((q, index) => (
              <th key={q.id} className="border px-4 py-2 max-w-xs break-words text-left">
                Q{index + 1}
              </th>
            ))}

          </tr>
        </thead>
        <tbody>
          {responses.map(row => (
            <tr key={row.id} className="text-sm hover:bg-gray-50">
              <td className="border px-4 py-2 sticky left-0 bg-white font-medium">{row.id}</td>
              <td className="border px-4 py-2">{row.date}</td>
              <td className="border px-4 py-2">{row.time}</td>
              {questions.map(q => (
                <td key={q.id} className="border px-4 py-2 max-w-xs break-words">
                  {row.answers[q.id] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RespondentData;
