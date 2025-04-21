import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import API from "../services/api"; // asumsi API service

export default function SurveyPreview({ auth, survey: initialSurvey }) {
    const [survey, setSurvey] = useState(initialSurvey); // 
    const [answers, setAnswers] = useState({});
    const slug = initialSurvey?.slug;
  

  useEffect(() => {
    API.get(`/survey-link/${slug}`)
        .then((res) => {
            console.log("Data dari backend:", res.data); 
            console.log("Pertanyaan:", res.data.questions); 
            setSurvey(res.data);

            const initialAnswers = {};
            res.data.questions.forEach((q) => {
                initialAnswers[q.id] = "";
            });
            setAnswers(initialAnswers);
        })
        .catch((err) => {
            console.error("Gagal ambil survey", err);
        });
}, []);

  const handleInputChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
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
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
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
                        checked={answers[q.id] === opt.option_text}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                      />
                      <span>{opt.option_text}</span>
                    </label>
                  ))}

                {/* Likert Scale */}
                {q.question_type === "Likert Scale" && (
                  <div className="flex space-x-4 mt-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex flex-col items-center">
                        <span>{opt.option_text}</span>
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          value={opt.option_text}
                          checked={answers[q.id] === opt.option_text}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className="w-6 h-6"
                        />
                      </label>
                    ))}
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
