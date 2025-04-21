import { useState, useEffect } from "react";

export default function QuestionSection({ onQuestionsChange }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      type: "Choose Type",
      isOpen: false,
      choices: [],
      likertLabels: [],
      placeholderText: ""
    }
  ]);

  const options = [
    { label: "Multiple Choices", icon: "📋" },
    { label: "Text", icon: "📝" },
    { label: "Likert Scale", icon: "📊" }
  ];

  useEffect(() => {
    if (onQuestionsChange) {
      onQuestionsChange(questions);
    }
  }, [questions]);

  const handleChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const addChoice = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push("");
    setQuestions(updatedQuestions);
  };

  const removeChoice = (index, choiceIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].choices.length > 1) {
      updatedQuestions[index].choices.splice(choiceIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const updateLikertLabel = (index, labelIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].likertLabels[labelIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const newQuestion = {
      id: newId,
      text: "",
      type: "Choose Type",
      isOpen: false,
      choices: [],
      likertLabels: [],
      placeholderText: ""
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length === 1) return; // minimal 1 pertanyaan wajib ada
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mt-4">Question</h3>

      <div className="space-y-3 mt-3">
        {questions.map((question, index) => (
          <div key={question.id} className="px-4 py-3 border rounded bg-[#E5E5E5] relative">

            {/* Tombol Hapus */}
            {questions.length > 1 && (
              <button
                onClick={() => handleDeleteQuestion(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                title="Hapus Pertanyaan"
              >
                ✖
              </button>
            )}

            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-bold text-lg">{(index + 1).toString().padStart(2, "0")}</span>

              <input
                type="text"
                placeholder="Enter Your Question..."
                value={question.text}
                onChange={(e) => handleChange(index, "text", e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-400 rounded-none text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="relative w-48">
                <button
                  className="w-full px-3 py-1 border border-gray-400 bg-white text-sm flex items-center justify-between rounded-none outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={() => handleChange(index, "isOpen", !question.isOpen)}
                >
                  <span>{question.type}</span>
                  <img src="/assets/icon-drop.svg" alt="dropdown icon" className="w-5 h-5" />
                </button>

                {question.isOpen && (
                  <ul className="absolute w-full mt-1 border border-gray-400 bg-white shadow-lg z-10 rounded">
                    {options.map((option) => (
                      <li
                        key={option.label}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleChange(index, "type", option.label);
                          handleChange(index, "isOpen", false);

                          if (option.label === "Multiple Choices") {
                            handleChange(index, "choices", [""]);
                          } else {
                            handleChange(index, "choices", []);
                          }

                          if (option.label === "Text") {
                            handleChange(index, "placeholderText", "Enter your response...");
                          } else {
                            handleChange(index, "placeholderText", "");
                          }

                          if (option.label === "Likert Scale") {
                            handleChange(index, "likertLabels", [
                              "Strongly Disagree",
                              "Disagree",
                              "Neutral",
                              "Agree",
                              "Strongly Agree"
                            ]);
                          }
                        }}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {question.type === "Text" && (
              <div className="mt-3 px-4">
                <input
                  type="text"
                  className="border border-gray-400 ml-4 p-2 text-sm w-[77%] rounded mt-1"
                  placeholder="Text answer placeholder..."
                  value={question.placeholderText}
                  onChange={(e) => handleChange(index, 'placeholderText', e.target.value)}
                />
              </div>
            )}

            {question.type === "Multiple Choices" && (
              <div className="mt-3 space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center gap-2 ml-8 mr-8">
                    <input
                      type="text"
                      placeholder="Enter an answer choice"
                      className="border border-gray-400 text-sm p-2 w-full rounded mr-1"
                      value={choice}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].choices[choiceIndex] = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                    />
                    <button
                      onClick={() => addChoice(index)}
                      className="p-2 bg-green-500 text-white rounded w-10 h-10 flex items-center justify-center"
                    >
                      +
                    </button>
                    {question.choices.length > 1 && (
                      <button
                        onClick={() => removeChoice(index, choiceIndex)}
                        className="p-2 bg-red-500 text-white rounded w-10 h-10 mr-20 flex items-center justify-center"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {question.type === "Likert Scale" && (
              <div className="mt-3 space-y-2">
                {question.likertLabels.map((label, labelIndex) => (
                  <div key={labelIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="border p-2 w-full text-sm ml-8 rounded border-gray-400"
                      value={label}
                      onChange={(e) => updateLikertLabel(index, labelIndex, e.target.value)}
                      style={{ minWidth: "150px", maxWidth: "350px" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tombol Tambah Pertanyaan */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Tambah Pertanyaan
        </button>
      </div>
    </div>
  );
}
