import { AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Data from "@/interface/data.interface";
import { time } from "console";

const QuestionScreen = ({ data }: { data: Data }) => {
    const [timer, setTimer] = useState(30);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestions = data.questions.length;
    const question = data.questions[currentQuestionIndex];

    const parsedQuestion = question.question.split(/_+/g);
    const blanksCount = parsedQuestion.length - 1;
    const [quizEnded, setQuizEnded] = useState(false);

    const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(Array(blanksCount).fill(null));
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
    useEffect(() => {
        if (quizEnded) return; // stop timer if quiz has ended

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    if (currentQuestionIndex < totalQuestions - 1) {
                        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                        setTimer(30);
                        setFilledBlanks(Array(blanksCount).fill(null));
                        setDisabledOptions([]);
                    } else {
                        setQuizEnded(true);
                        setTimer(0)
                        clearInterval(interval);
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

    const goToNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(30);
            setFilledBlanks(Array(blanksCount).fill(null));
            setDisabledOptions([]);
        }
    };

    if (timer === 0) {
        goToNextQuestion()
        setTimer(30)
    }
    if (quizEnded) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700">🎉 Quiz Ended!</div>
            </div>
        );
    }
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
                        {question.options.map((option, idx) => (
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
