import { AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Data from "@/interface/data.interface";
import { useNavigate } from "react-router-dom";

const QuestionScreen = ({ data }: { data: Data }) => {
    const navigate = useNavigate();
    const totalQuestions = data.questions.length;

    // Load from localStorage or use default values
    const getInitialIndex = () => Number(localStorage.getItem("currentQuestionIndex")) || 0;
    const getInitialTimer = () => Number(localStorage.getItem("timer")) || 30;
    const getInitialAnswers = () => JSON.parse(localStorage.getItem("collectedAnswers") || "[]");
    const getInitialBlanks = () => JSON.parse(localStorage.getItem("filledBlanks") || "null");
    const getInitialDisabled = () => JSON.parse(localStorage.getItem("disabledOptions") || "[]");

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialIndex());
    const [timer, setTimer] = useState(getInitialTimer());
    const [quizEnded, setQuizEnded] = useState(false);

    const currentQuestion = data.questions[currentQuestionIndex];
    const parsedQuestion = currentQuestion.question.split(/_+/g);
    const blanksCount = parsedQuestion.length - 1;

    const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(
        getInitialBlanks() ?? Array(blanksCount).fill(null)
    );

    const [disabledOptions, setDisabledOptions] = useState<string[]>(getInitialDisabled());
    const [collectedAnswers, setCollectedAnswers] = useState<
        { questionId: string; question: string; userResponse: string[]; correctAnswer: string[] }[]
    >(getInitialAnswers());

    // Save state changes to localStorage
    useEffect(() => {
        localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
        localStorage.setItem("timer", timer.toString());
        localStorage.setItem("filledBlanks", JSON.stringify(filledBlanks));
        localStorage.setItem("disabledOptions", JSON.stringify(disabledOptions));
        localStorage.setItem("collectedAnswers", JSON.stringify(collectedAnswers));
    }, [currentQuestionIndex, timer, filledBlanks, disabledOptions, collectedAnswers]);

    useEffect(() => {
        if (quizEnded) return;
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    storeAnswer();
                    if (currentQuestionIndex < totalQuestions - 1) {
                        const nextIndex = currentQuestionIndex + 1;
                        setCurrentQuestionIndex(nextIndex);
                        setTimer(30);
                        const newBlank = Array(data.questions[nextIndex].question.split(/_+/g).length - 1).fill(null);
                        setFilledBlanks(newBlank);
                        setDisabledOptions([]);
                    } else {
                        setQuizEnded(true);
                        setTimer(0);
                        clearInterval(interval);
                        // Store final answer and navigate to review
                        const finalEntry = {
                            questionId: currentQuestion.questionId,
                            question: currentQuestion.question,
                            userResponse: filledBlanks.map((ans) => ans || ""),
                            correctAnswer: currentQuestion.correctAnswer,
                        };
                        const finalAnswers = [...collectedAnswers, finalEntry];
                        localStorage.setItem("quizResults", JSON.stringify(finalAnswers));
                        localStorage.removeItem("currentQuestionIndex");
                        localStorage.removeItem("timer");
                        localStorage.removeItem("filledBlanks");
                        localStorage.removeItem("disabledOptions");
                        localStorage.removeItem("collectedAnswers");
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

    const storeAnswer = () => {
        const entry = {
            questionId: currentQuestion.questionId,
            question: currentQuestion.question,
            userResponse: filledBlanks.map((val) => val || ""),
            correctAnswer: currentQuestion.correctAnswer,
        };
        setCollectedAnswers((prev) => [...prev, entry]);
    };

    const goToNextQuestion = () => {
        storeAnswer();
        if (currentQuestionIndex < totalQuestions - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setTimer(30);
            const newBlank = Array(data.questions[nextIndex].question.split(/_+/g).length - 1).fill(null);
            setFilledBlanks(newBlank);
            setDisabledOptions([]);
        } else {
            // Last question: end quiz and navigate to review
            const finalEntry = {
                questionId: currentQuestion.questionId,
                question: currentQuestion.question,
                userResponse: filledBlanks.map((val) => val || ""),
                correctAnswer: currentQuestion.correctAnswer,
            };
            const finalAnswers = [...collectedAnswers, finalEntry];
            localStorage.setItem("quizResults", JSON.stringify(finalAnswers));
            localStorage.removeItem("currentQuestionIndex");
            localStorage.removeItem("timer");
            localStorage.removeItem("filledBlanks");
            localStorage.removeItem("disabledOptions");
            localStorage.removeItem("collectedAnswers");
            navigate("/ended");
        }
    };

    const handleQuit = () => {
        // Store the current question answer
        const currentAnswer = {
            questionId: currentQuestion.questionId,
            question: currentQuestion.question,
            userResponse: filledBlanks.map((val) => val || ""),
            correctAnswer: currentQuestion.correctAnswer,
        };

        const answeredQuestions = [...collectedAnswers, currentAnswer];

        // Fill the rest of the unanswered questions as incorrect
        const remainingQuestions = data.questions
            .slice(currentQuestionIndex + 1)
            .map((q) => ({
                questionId: q.questionId,
                question: q.question,
                userResponse: q.correctAnswer.map(() => ""), // empty strings = unanswered
                correctAnswer: q.correctAnswer,
            }));

        const fullQuizResults = [...answeredQuestions, ...remainingQuestions];

        localStorage.setItem("quizResults", JSON.stringify(fullQuizResults));
        localStorage.removeItem("currentQuestionIndex");
        localStorage.removeItem("timer");
        localStorage.removeItem("filledBlanks");
        localStorage.removeItem("disabledOptions");
        localStorage.removeItem("collectedAnswers");

        navigate("/ended");
    };

    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
            <div
                className="relative bg-white rounded-[24px] p-[20px] sm:p-[30px] lg:p-[40px] flex flex-col justify-between max-w-full"
                style={{ maxWidth: "975px", height: "650px", gap: "6px" }}
            >
                {/* Top bar */}
                <div className="flex justify-between items-center" style={{ height: "38px" }}>
                    <div className="text-blue-500 text-lg font-semibold">⏱ {timer}s</div>
                    <Button
                        onClick={handleQuit}
                        className="bg-red-100 text-red-500 hover:bg-red-200 w-[90px] h-[38px] text-sm font-medium rounded-[8px]"
                    >
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
                    className="text-center text-gray-800 font-semibold text-[20px] leading-[22px] sm:w-[80%] lg:w-[811px] mx-auto"
                    style={{ height: "166px", gap: "18px" }}
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
                                        {filledBlanks[idx]?.toLocaleLowerCase() || ""}
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div
                    className="flex flex-wrap justify-center items-center"
                    style={{ gap: "16px", width: "100%", height: "252px" }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
                        {currentQuestion.options.map((option, idx) => (
                            <Button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                className="text-gray-800 text-sm font-medium hover:bg-blue-50"
                                style={{
                                    width: "100%",
                                    maxWidth: "377px",
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

                {/* Next Button (Icon Only) */}
                <div className="absolute bottom-10 right-10">
                    <button
                        onClick={goToNextQuestion}
                        disabled={!filledBlanks.every((blank) => blank !== null)}
                        className={`w-12 h-12 border-2 flex items-center justify-center rounded-md transition ${filledBlanks.every((blank) => blank !== null)
                            ? "border-blue-500 text-blue-500 hover:bg-blue-100"
                            : "border-gray-300 text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <AiOutlineRight className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;
