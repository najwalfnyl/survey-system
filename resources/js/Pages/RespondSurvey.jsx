import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import API from "../services/api"; // asumsi API service

export default function RespondSurvey({ survey: initialSurvey }) {
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

        const initialAnswers = {};
        res.data.questions.forEach((q) => {
          initialAnswers[q.id] = {
            entity: "", // Untuk menyimpan entitas yang dipilih
            scale: "", // Untuk menyimpan skala yang dipilih
          };
        });
        setAnswers(initialAnswers);
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

  if (!survey) return <div className="p-8">Loading survey...</div>;

  // Cek apakah survey sudah ditutup
  if (survey.status === "closed") {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Head title="Survey Closed" />
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Maaf, Survei Ini Telah Ditutup</h1>
          <p className="text-gray-600">
            Survei ini sudah ditutup dan tidak dapat diakses lagi. Terima kasih atas perhatian Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Head title="Respond Survey" />

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {survey.questions.map((q, index) => (
            <div key={q.id} className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold mb-2">
                {index + 1}. {q.question_text}
              </p>

              {/* Text Question */}
              {q.question_type === "Text" && (
                <input
                  type="text"
                  placeholder={q.placeholder_text}
                  value={answers[q.id]?.answer_text || ""}
                  onChange={(e) => handleInputChange(q.id, "answer_text", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              )}

              {/* Multiple Choice */}
              {q.question_type === "Multiple Choices" &&
                q.options.map((opt) => (
                  <label key={opt.id} className="block mb-1">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt.id}
                      checked={String(answers[q.id]?.option_id) === String(opt.id)}
                      onChange={(e) => {
                        handleInputChange(q.id, "option_id", e.target.value);
                        console.log(e.target.value);
                      }}
                      className="mr-2"
                    />
                    {opt.option_text}
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
                      className="w-full border border-gray-300 p-2 rounded"
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
                  <div className="flex space-x-4 mt-2">
                    {q.likert_scales && q.likert_scales.length > 0 ? (
                      q.likert_scales.map((scale) => (
                        <label key={scale.id} className="flex flex-col items-center text-sm">
                          <span>{scale.scale_label}</span>
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={scale.scale_value}
                            checked={answers[q.id]?.scale === scale.scale_value.toString()}
                            onChange={(e) => handleInputChange(q.id, "scale", e.target.value)}
                            className="mt-1"
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
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 inline-block"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
