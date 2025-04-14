import { AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Data from "@/interface/data.interface";

const QuestionScreen = ({ data }: { data: Data }) => {
    const [timer, setTimer] = useState(30);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestions = data.questions.length;
    const question = data.questions[currentQuestionIndex];

    const parsedQuestion = question.question.split("___");
    const blanksCount = parsedQuestion.length - 1;

    const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(Array(blanksCount).fill(null));
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

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

    return (
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            <div
                className="relative bg-white rounded-[24px] p-[40px] flex flex-col justify-between"
                style={{ width: "975px", height: "650px", gap: "56px" }}
            >
                {/* Top bar */}
                <div className="flex justify-between items-center" style={{ height: "38px" }}>
                    <div className="text-blue-500 text-lg font-semibold">⏱ {timer}s</div>
                    <Button className="bg-red-100 text-red-500 hover:bg-red-200 w-[90px] h-[38px] text-sm font-medium rounded-[8px]">
                        Quit
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mt-6" style={{ height: "16px" }}>
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-3 rounded-full flex-1 ${i <= currentQuestionIndex ? "bg-yellow-400" : "bg-gray-200"}`}
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
                                {part}
                                {idx !== parsedQuestion.length - 1 && (
                                    <button
                                        className="inline-flex items-center justify-center border-b-2 border-dashed border-gray-400 text-blue-500 font-semibold transition hover:bg-gray-100"
                                        style={{
                                            width: "97px",
                                            height: "42px",
                                            margin: "0 4px",
                                        }}
                                        onClick={() => handleBlankClick(idx)}
                                    >
                                        {filledBlanks[idx] || "_______"}
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
                                    borderRadius: "8px",
                                    borderWidth: "1px",
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
                        className="w-12 h-12 border-2 border-blue-500 flex items-center justify-center rounded-md hover:bg-blue-100 transition"
                    >
                        <AiOutlineRight className="text-blue-500 text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;
