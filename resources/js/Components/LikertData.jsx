import React, { useEffect, useState } from "react";
import axios from "axios";

const LIKERT_LEVELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const LikertData = ({ slug }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/analyze-survey/${slug}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((response) => {
        setAnalysisData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Likert data:", error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading Likert data...</div>;

  if (
    !analysisData ||
    !analysisData.questions ||
    analysisData.questions.length === 0
  ) {
    return <div>No Likert data available.</div>;
  }

  // Filter pertanyaan tipe Likert Scale
  const likertQuestions = analysisData.questions.filter(
    (q) => q.question_type === "Likert Scale"
  );

  // Fungsi hitung total count per entitas untuk tiap level
  const getTotalsPerEntity = (entity) => {
    return LIKERT_LEVELS.reduce((acc, level) => {
      const count = entity.scales.find((s) => s.scale === level)?.count || 0;
      acc[level] = count;
      return acc;
    }, {});
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Likert Scale Data</h2>

      {likertQuestions.length === 0 ? (
        <p>Tidak ada pertanyaan tipe Likert Scale.</p>
      ) : (
        likertQuestions.map((q, index) => (
          <div
            key={q.question_id}
            className="border p-4 rounded-lg bg-gray-100 mb-6"
          >
            <h4 className="text-gray-700 font-semibold mb-4">
              {`Q${index + 1}: ${q.question_text}`}
            </h4>

            {q.summary.map((entity, eIndex) => {
              const totals = getTotalsPerEntity(entity);
              return (
                <table
                  key={eIndex}
                  className="w-full border-collapse border border-gray-300 mb-6"
                >
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2 text-left">Entitas</th>
                      {LIKERT_LEVELS.map((level) => (
                        <th
                          key={level}
                          className="border px-4 py-2 text-center min-w-[100px]"
                        >
                          {level}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-sm even:bg-gray-50 odd:bg-white">
                      <td className="border px-4 py-2 font-medium">{entity.entity}</td>
                      {LIKERT_LEVELS.map((level) => {
                        const scaleCount =
                          entity.scales.find((s) => s.scale === level)?.count || 0;
                        return (
                          <td key={level} className="border px-4 py-2 text-center">
                            {scaleCount}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="text-sm bg-gray-200 font-semibold">
                      <td className="border px-4 py-2 text-left">Total</td>
                      {LIKERT_LEVELS.map((level) => (
                        <td key={level} className="border px-4 py-2 text-center">
                          {totals[level]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default LikertData;
