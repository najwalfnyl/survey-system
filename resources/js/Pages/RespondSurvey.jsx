import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function RespondSurvey({ survey }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/respond/${survey.slug}`, { answers });
      alert("Terima kasih atas partisipasinya!");
    } catch (err) {
      console.error("Gagal submit jawaban:", err);
      alert("Gagal mengirim jawaban.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{survey.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
      {survey.questions.map((q, index) => (
  <div key={q.id} className="mb-6">
    <p className="mb-2 font-medium">
      {index + 1}. {q.question_text}
    </p>

    {/* Text Question */}
    {q.question_type === "Text" && (
      <input
        type="text"
        placeholder={q.placeholder_text}
        value={answers[q.id] || ""}
        onChange={(e) => handleChange(q.id, e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    )}

    {/* Multiple Choices */}
    {q.question_type === "Multiple Choices" &&
      q.options.map((opt) => (
        <label key={opt.id} className="block mb-1">
          <input
            type="radio"
            name={`q_${q.id}`}
            value={opt.option_text}
            checked={answers[q.id] === opt.option_text}
            onChange={(e) => handleChange(q.id, e.target.value)}
            className="mr-2"
          />
          {opt.option_text}
        </label>
      ))}

    {/* Likert Scale */}
    {q.question_type === "Likert Scale" && (
      <div className="flex gap-4">
        {q.options.map((opt) => (
          <label key={opt.id} className="flex flex-col items-center text-sm">
            <span>{opt.option_text}</span>
            <input
              type="radio"
              name={`q_${q.id}`}
              value={opt.option_text}
              checked={answers[q.id] === opt.option_text}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="mt-1"
            />
          </label>
        ))}
      </div>
    )}
  </div>
))}


        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
