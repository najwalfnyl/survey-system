import React from "react";

const RespondentData = () => {
  const data = [
    { id: 1, date: "05/01/2025", time: "05:00", q1: "lorem ipsum dolor sit", q2: "lorem ipsum", q3: "lorem ipsum" },
    { id: 2, date: "05/01/2025", time: "06:15", q1: "lorem ipsum dolor sit", q2: "lorem ipsum", q3: "lorem ipsum" },
    { id: 3, date: "05/01/2025", time: "06:15", q1: "lorem ipsum dolor sit", q2: "lorem ipsum", q3: "lorem ipsum" },
    { id: 4, date: "05/01/2025", time: "06:15", q1: "lorem ipsum dolor sit", q2: "lorem ipsum", q3: "lorem ipsum" },
    { id: 5, date: "05/01/2025", time: "06:15", q1: "lorem ipsum dolor sit", q2: "lorem ipsum", q3: "lorem ipsum" }
  ];

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead className="bg-gray-300">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Input Date</th>
            <th className="border px-4 py-2">Time Spent</th>
            <th className="border px-4 py-2">Q1</th>
            <th className="border px-4 py-2">Q2</th>
            <th className="border px-4 py-2">Q3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="border px-4 py-2">{row.id}</td>
              <td className="border px-4 py-2">{row.date}</td>
              <td className="border px-4 py-2">{row.time}</td>
              <td className="border px-4 py-2">{row.q1}</td>
              <td className="border px-4 py-2">{row.q2}</td>
              <td className="border px-4 py-2">{row.q3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RespondentData;
