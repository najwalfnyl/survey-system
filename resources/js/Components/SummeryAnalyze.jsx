import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "abcd", value: 50, color: "#4169E1" },
  { name: "bcde", value: 25, color: "#228B22" },
  { name: "cdef", value: 25, color: "#FFD700" }
];

const SummeryAnalyze = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="border p-4 rounded-lg bg-gray-100">
        <h4 className="text-gray-700 font-semibold">Q1</h4>
        <p className="text-gray-600 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porta eu diam sed pulvinar.</p>
        <div className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Answer Choices</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Responses</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.value}%</td>
              </tr>
            ))}
            <tr className="bg-gray-200">
              <td className="border border-gray-300 px-4 py-2 font-bold">TOTAL</td>
              <td className="border border-gray-300 px-4 py-2 font-bold">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummeryAnalyze;
