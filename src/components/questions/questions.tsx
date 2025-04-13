import { AiOutlineRight } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Data from "@/interface/data.interface";

const QuestionScreen = ({ data }: { data: Data }) => {
    const [timer, setTimer] = useState(30);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const question = data.questions[currentQuestionIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const totalQuestions = data.questions.length;

    return (
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            <div
                className="relative bg-white rounded-[24px] p-[40px] flex flex-col"
                style={{ width: "975px", height: "650px", gap: "56px" }}
            >
                {/* Top bar with Timer and Quit */}
                <div className="flex justify-between items-center">
                    <div className="text-blue-500 text-lg font-semibold">
                        ⏱ {timer}s
                    </div>
                    <Button className="bg-red-100 text-red-500 hover:bg-red-200">
                        Quit
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{
                            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                        }}
                    ></div>
                </div>

                {/* Question */}
                <div className="text-xl font-medium text-gray-800">
                    {question.question}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option, idx) => (
                        <Button
                            key={idx}
                            className="bg-gray-100 hover:bg-blue-100 text-gray-800 px-6 py-3 rounded-lg text-base"
                        >
                            {option}
                        </Button>
                    ))}
                </div>

                {/* Bottom right arrow button */}
                <div className="absolute bottom-10 right-10">
                    <Button
                        onClick={() =>
                            setCurrentQuestionIndex((prev) =>
                                prev < totalQuestions - 1 ? prev + 1 : prev
                            )
                        }
                        className="bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600"
                    >
                        <AiOutlineRight className="text-xl" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;
