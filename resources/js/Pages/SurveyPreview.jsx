import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import API from "../services/api"; // asumsi API service

export default function SurveyPreview({ auth, survey: initialSurvey }) {
  const [survey, setSurvey] = useState(initialSurvey);
  const [answers, setAnswers] = useState({});
  const slug = initialSurvey?.slug;

  useEffect(() => {
    API.get(`/survey-link/${slug}`)
      .then((res) => {
        console.log("Data dari backend:", res.data);
        console.log("Pertanyaan:", res.data.questions);
        res.data.questions.forEach((q) => {
          console.log(`Likert Scales for question ${q.id}:`, q.likertScales);
        });
        setSurvey(res.data);
        // ... (rest of your code)
      })
      .catch((err) => {
        console.error("Gagal ambil survey", err);
      });
  }, []);



  const handleInputChange = (questionId, key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [key]: value,
      },
    }));
  };

  if (!survey) return <div className="p-8">Loading survey...</div>;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Survey Preview" />

      <div className="py-12 px-7">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>

          {/* Daftar Pertanyaan */}
          {survey.questions && survey.questions.length > 0 ? (
            survey.questions.map((q, index) => (
              <div key={q.id} className="mb-4">
                <p className="font-semibold">
                  {index + 1}. {q.question_text}
                </p>

                {/* Text */}
                {q.question_type === "Text" && (
                  <input
                    type="text"
                    placeholder={q.placeholder_text}
                    value={answers[q.id]?.scale || ""}
                    onChange={(e) => handleInputChange(q.id, "scale", e.target.value)}
                    className="w-full border rounded-lg p-2 mt-2"
                  />
                )}

                {/* Multiple Choice */}
                {q.question_type === "Multiple Choices" &&
                  q.options.map((opt) => (
                    <label key={opt.id} className="flex items-center space-x-2 mt-1">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt.option_text}
                        checked={answers[q.id]?.scale === opt.option_text}
                        onChange={(e) => handleInputChange(q.id, "scale", e.target.value)}
                      />
                      <span>{opt.option_text}</span>
                    </label>
                  ))}

                {/* Likert Scale */}
                {q.question_type === "Likert Scale" && (
                  <div className="mt-4">
                    {/* Dropdown untuk Entitas */}
                    <div className="mb-2">
                      <label className="block font-semibold mb-1">Select Entity:</label>
                      <select
                        value={answers[q.id]?.entity || ""}
                        onChange={(e) => handleInputChange(q.id, "entity", e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">-- Select Entity --</option>
                        {q.entities && q.entities.map((entity) => (
                          <option key={entity.id} value={entity.entity_name}>
                            {entity.entity_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Radio Buttons untuk Skala Likert */}
                    {/* Radio Buttons untuk Skala Likert */}
                    <div className="flex space-x-4 mt-2">
                      {q.likert_scales && q.likert_scales.length > 0 ? (
                        q.likert_scales.map((scale) => (
                          <label key={scale.id} className="flex flex-col items-center">
                            <span>{scale.scale_label}</span>
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={scale.scale_value}
                              checked={answers[q.id]?.scale === scale.scale_value.toString()}
                              onChange={(e) => handleInputChange(q.id, "scale", e.target.value)}
                              className="w-6 h-6"
                            />
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500">No scales available for this question.</p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada pertanyaan pada survey ini.</p>
          )}

          {/* DONE button */}
          <div className="text-center mt-6">
            <Link
              href={route("status-survey", { slug: survey.slug })}
              className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 inline-block"
            >
              DONE
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
