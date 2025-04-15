import { AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Data from "@/interface/data.interface";
import { useNavigate } from "react-router-dom";


const QuestionScreen = ({ data }: { data: Data }) => {
    const navigate = useNavigate();
    const totalQuestions = data.questions.length;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(30);
    const [quizEnded, setQuizEnded] = useState(false);

    const currentQuestion = data.questions[currentQuestionIndex];
    // Split the question string by one or more underscores.
    const parsedQuestion = currentQuestion.question.split(/_+/g);
    const blanksCount = parsedQuestion.length - 1;

    // Store filled answers; each entry corresponds to a blank.
    const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(Array(blanksCount).fill(null));
    // Disable an option if it was selected
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

    // This state collects answers for each question.
    // Each entry: { questionId, userResponse (array of strings), correctAnswer }
    const [collectedAnswers, setCollectedAnswers] = useState<
        { questionId: string; question: string; userResponse: string[]; correctAnswer: string[] }[]
    >([]);

    // Timer effect – when timer reaches 0, auto-advance the question.
    useEffect(() => {
        if (quizEnded) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    storeAnswer(); // store current question's responses
                    // If more questions, move to next; otherwise, quiz ended.
                    if (currentQuestionIndex < totalQuestions - 1) {
                        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                        setTimer(30);
                        setFilledBlanks(Array(blanksCount).fill(null));
                        setDisabledOptions([]);
                    } else {
                        // Last question finished: mark quiz ended, save answers, and navigate.
                        setQuizEnded(true);
                        setTimer(0);
                        clearInterval(interval);
                        // Save to localStorage and navigate after a slight delay
                        localStorage.setItem("quizResults", JSON.stringify(collectedAnswers.concat([{
                            questionId: currentQuestion.questionId,
                            question: currentQuestion.question,
                            userResponse: filledBlanks.map((ans) => ans || ""),
                            correctAnswer: currentQuestion.correctAnswer,
                        }])));
                        navigate("/ended");
                    }
                }
                return prev > 0 ? prev - 1 : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, currentQuestionIndex, quizEnded]);

    const handleOptionClick = (option: string) => {
        const nextEmptyIndex = filledBlanks.findIndex((blank) => blank === null);
        if (nextEmptyIndex === -1) return;

        const updated = [...filledBlanks];
        updated[nextEmptyIndex] = option;
        setFilledBlanks(updated);
        setDisabledOptions((prev) => [...prev, option]);
    };

    const handleBlankClick = (index: number) => {
        const value = filledBlanks[index];
        if (!value) return;

        const updated = [...filledBlanks];
        updated[index] = null;
        setFilledBlanks(updated);
        setDisabledOptions((prev) => prev.filter((opt) => opt !== value));
    };

    // Store current question's answer in our collectedAnswers state.
    const storeAnswer = () => {
        const entry = {
            questionId: currentQuestion.questionId,
            question: currentQuestion.question,
            userResponse: filledBlanks.map((val) => val || ""),
            correctAnswer: currentQuestion.correctAnswer,
        };
        setCollectedAnswers((prev) => [...prev, entry]);
    };

    // Manual "Next" button – also store answer then move to next.
    const goToNextQuestion = () => {
        storeAnswer();
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(30);
            setFilledBlanks(Array(blanksCount).fill(null));
            setDisabledOptions([]);
        }
    };

    // If quiz ended, we have navigated away; otherwise, render the question screen.
    return (
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            <div
                className="relative bg-white rounded-[24px] p-[40px] flex flex-col justify-between"
                style={{ width: "975px", height: "650px", gap: "6px" }}
            >
                {/* Top bar */}
                <div className="flex justify-between items-center" style={{ height: "38px" }}>
                    <div className="text-blue-500 text-lg font-semibold">⏱ {timer}s</div>
                    <Button className="bg-red-100 text-red-500 hover:bg-red-200 w-[90px] h-[38px] text-sm font-medium rounded-[8px]">
                        Quit
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mt-6" style={{ height: "16px", paddingBottom: "6rem" }}>
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full flex-1 ${i <= currentQuestionIndex ? "bg-yellow-400" : "bg-gray-200"}`}
                        />
                    ))}
                </div>

                {/* Question with blanks */}
                <div
                    className="text-center text-gray-800 font-semibold text-[20px] leading-[22px]"
                    style={{ width: "811px", height: "166px", gap: "18px", alignSelf: "center" }}
                >
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {parsedQuestion.map((part, idx) => (
                            <span key={idx} className="text-lg font-medium flex items-center">
                                {part.trim()}
                                {idx !== parsedQuestion.length - 1 && (
                                    <button
                                        onClick={() => handleBlankClick(idx)}
                                        className="min-w-[80px] h-[42px] border-b-2 border-dashed border-gray-400 text-blue-500 font-semibold transition hover:bg-gray-100 px-2"
                                    >
                                        {filledBlanks[idx] || ""}
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div
                    className="flex flex-wrap justify-center items-center"
                    style={{ width: "895px", height: "252px", gap: "64px" }}
                >
                    <div className="grid grid-cols-2 gap-[16px]">
                        {currentQuestion.options.map((option, idx) => (
                            <Button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                className="text-gray-800 text-sm font-medium hover:bg-blue-50"
                                style={{
                                    width: "377px",
                                    height: "38px",
                                    padding: "8px 12px",
                                    justifyContent: "center",
                                }}
                                variant="outline"
                                disabled={disabledOptions.includes(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <div className="absolute bottom-10 right-10">
                    <button
                        onClick={goToNextQuestion}
                        disabled={!filledBlanks.every((blank) => blank !== null)}
                        className={`w-12 h-12 border-2 flex items-center justify-center rounded-md transition
                ${filledBlanks.every((blank) => blank !== null)
                                ? "border-blue-500 text-blue-500 hover:bg-blue-100"
                                : "border-gray-300 text-gray-300 cursor-not-allowed"}
              `}
                    >
                        <AiOutlineRight className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;
