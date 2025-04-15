import React, { useEffect, useState } from "react";

interface ReviewEntry {
  question: string;
  userResponse: string[];
  correctAnswer: string[];
}

const QuizReviewScreen = () => {
  const [results, setResults] = useState<ReviewEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("quizResults");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const reconstructPrompt = (questionStr: string, answers: string[]) => {
    if (!questionStr) return "";

    const questionParts = questionStr.split(/_+/g);
    let constructed = "";

    for (let i = 0; i < questionParts.length; i++) {
      constructed += questionParts[i];
      if (i < answers.length) {
        constructed += answers[i];
      }
    }
    return constructed;
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-6">Quiz Review</h1>

      {results.map((entry, index) => {
        const isCorrect =
          JSON.stringify(entry.userResponse.map((a) => a.trim().toLowerCase())) ===
          JSON.stringify(entry.correctAnswer.map((a) => a.trim().toLowerCase()));

        const correctPrompt = reconstructPrompt(entry.question, entry.correctAnswer);
        const userPrompt = reconstructPrompt(entry.question, entry.userResponse);

        return (
          <div
            key={index}
            className="w-[700px] rounded-[16px] shadow-[0px_4px_70px_0px_#CB353E1A] overflow-hidden bg-white"
          >
            {/* Prompt Section */}
            <div className="w-full px-4 pt-4 pb-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="bg-gray-100 rounded-lg px-2 py-1">
                  <span className="text-[14px] leading-[20px] font-medium font-inter tracking-[-0.01em]">
                    Prompt
                  </span>
                </div>
              </div>

              <div className="rounded p-2">
                <div className="text-[16px] leading-[22px] font-medium font-inter">
                  {correctPrompt}
                </div>
              </div>
            </div>

            {/* Response Section */}
            <div className="w-full flex flex-col gap-3 bg-[#F6F9F9] p-6 rounded-b-[16px]">
              <div className="flex gap-3 items-center">
                <div className="text-[#616464] text-[16px] font-medium font-inter tracking-[-0.01em]">
                  Your response
                </div>

                {isCorrect ? (
                  <div className="bg-[#EEFBEF] rounded-[16px] px-2 py-1 flex items-center justify-center">
                    <span className="text-[#317F39] font-medium text-[16px] font-inter leading-[22px] tracking-[-0.01em]">
                      Correct
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#FCEBEC] rounded-[16px] px-2 py-1 flex items-center justify-center">
                    <span className="text-[#9E2930] font-medium text-[16px] font-inter leading-[22px] tracking-[-0.01em]">
                      Incorrect
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[16px] font-medium font-inter leading-[22px]">
                {userPrompt}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizReviewScreen;
