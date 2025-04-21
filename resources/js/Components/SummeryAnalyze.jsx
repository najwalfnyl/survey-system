import React from "react";
import { usePage } from "@inertiajs/react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF4", "#F97316"];

const SummeryAnalyze = () => {
  const { questions = [] } = usePage().props;

  if (!Array.isArray(questions)) {
    return <div className="text-center text-gray-500">Data belum tersedia.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      {questions.length === 0 ? (
        <div className="text-center text-gray-500">Tidak ada pertanyaan yang dapat dianalisis.</div>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="border p-4 rounded-lg bg-gray-100 mb-6">
            <h4 className="text-gray-700 font-semibold mb-2">{`Q${index + 1}`}</h4>
            <p className="text-gray-600 text-sm mb-4">{q.text}</p>

            {q.type === "Text" && (
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {q.summary.map((answer, i) => (
                  <li key={i}>{answer}</li>
                ))}
              </ul>
            )}

            {["Multiple Choices", "Multiple Choice"].includes(q.type) && (
              <>
                <div className="flex justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={q.summary}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {q.summary.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2 text-left">Answer</th>
                      <th className="border px-4 py-2 text-left">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.summary.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-4 py-2">{item.label}</td>
                        <td className="border px-4 py-2">{item.value}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {q.type === "Likert Scale" && (
              <>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={q.summary}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                    >
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="label" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2 text-left">Scale</th>
                      <th className="border px-4 py-2 text-left">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.summary.map((item, i) => (
                      <tr key={i}>
                        <td className="border px-4 py-2">{item.label}</td>
                        <td className="border px-4 py-2">{item.value}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SummeryAnalyze;
