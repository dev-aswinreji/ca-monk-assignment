import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReviewEntry {
  question: string;
  userResponse: string[];
  correctAnswer: string[];
}

const QuizReviewScreen = () => {
  const [results, setResults] = useState<ReviewEntry[]>([]);
  const navigate = useNavigate()

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

  // Calculate score
  let totalBlanks = 0;
  let correctBlanks = 0;

  results.forEach((entry) => {
    const user = entry.userResponse.map((s) => s.trim().toLowerCase());
    const correct = entry.correctAnswer.map((s) => s.trim().toLowerCase());

    totalBlanks += correct.length;

    correct.forEach((word, idx) => {
      if (user[idx] === word) {
        correctBlanks++;
      }
    });
  });

  const percentage = totalBlanks > 0 ? Math.round((correctBlanks / totalBlanks) * 100) : 0;


  const handleDashboard = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-6">Quiz Review</h1>

      {/* Ellipse Score Section */}
      <div className="w-[743px] h-[458.7px] flex flex-col items-center gap-[24px]">
        {/* Ellipse Shape */}
        <div className="w-[144.7px] h-[144.7px] border-[9.92px] border-[#317F39] rounded-full flex flex-col items-center justify-center">
          <div className="w-[66.97px] h-[62px] flex items-center justify-center">
            <span className="font-[PP Neue Montreal] text-[52.92px] font-medium leading-[61.19px] text-[#317F39] text-center">
              {percentage}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[14.33px] font-medium font-[PP Neue Montreal] leading-[16.54px] text-[#317F39] text-center">
              Overall Score
            </span>
          </div>
        </div>

        {/* Feedback Paragraph */}
        <div className="w-[743px] h-[84px] text-center text-[#2A2D2D] font-inter text-[18px] leading-[28px] font-normal tracking-[-0.01em]">
          While you correctly formed several sentences, there are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness. Review your responses below for more details.
        </div>

        {/* Go to Dashboard Button */}
        <div className="w-[270.5px] h-[110px] flex flex-col gap-4 items-center">
          <button className="w-[270.5px] h-[54px] border border-[#453FE1] rounded-[8px] px-6 py-4 flex items-center justify-center" onClick={handleDashboard}>
            <span className="text-[#453FE1] font-inter font-medium text-[16px] leading-[22px] tracking-[-0.01em]">
              Go to Dashboard
            </span>
          </button>
        </div>
      </div>

      {/* Quiz Review Cards */}
      {results.map((entry, index) => {
        const isCorrect = entry.userResponse.every(
          (word, i) =>
            word.trim().toLowerCase() ===
            (entry.correctAnswer[i] || "").trim().toLowerCase()
        );

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
