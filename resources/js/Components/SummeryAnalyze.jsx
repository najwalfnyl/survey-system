import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF4", "#F97316"];

const renderMultipleChoices = (q) => {
  const totalCount = q.summary.reduce((sum, item) => sum + item.count, 0);
  const dataWithPercent = q.summary.map((item) => ({
    ...item,
    value: totalCount > 0 ? Number(((item.count / totalCount) * 100).toFixed(2)) : 0,
  }));

  const allZero = dataWithPercent.every((item) => item.value === 0);
  if (allZero) {
    return <p className="text-center text-gray-500">No data to display in chart.</p>;
  }

  return (
    <>
      <div className="flex justify-center items-center w-full" style={{ height: 300 }}>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={dataWithPercent}
              dataKey="value"
              nameKey="label"
              outerRadius={100}
              label
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Answer</th>
            <th className="border px-4 py-2">Count</th>
            <th className="border px-4 py-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {dataWithPercent.map((item, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{item.label}</td>
              <td className="border px-4 py-2">{item.count}</td>
              <td className="border px-4 py-2">{item.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const SummeryAnalyze = ({ slug }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/analyze-survey/${slug}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
      .then((response) => {
        setAnalysisData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching survey analysis:", error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading...</div>;

  if (!analysisData || !analysisData.questions || analysisData.questions.length === 0) {
    return <div>No summary data available for this survey.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Total Responses: {analysisData.total_responses}</h2>

      {analysisData.questions.map((q, index) => (
        <div key={q.question_id} className="border p-4 rounded-lg bg-gray-100 mb-6">
          <h4 className="text-gray-700 font-semibold mb-2">{`Q${index + 1}: ${q.question_text}`}</h4>

          {q.question_type === "Text" && (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {q.summary.length ? (
                q.summary.map((answer, i) => <li key={i}>{answer}</li>)
              ) : (
                <li>No responses yet.</li>
              )}
            </ul>
          )}

          {q.question_type === "Multiple Choices" && renderMultipleChoices(q)}

          {q.question_type === "Likert Scale" && (
            <>
              {q.summary.map((entity, eIndex) => (
                <div key={eIndex}>
                  <h5 className="font-medium text-gray-700">{entity.entity}</h5>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={entity.scales}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="scale" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummeryAnalyze;
