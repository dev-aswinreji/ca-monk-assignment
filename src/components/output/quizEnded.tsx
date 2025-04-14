const QuizEndedScreen = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <div
                className="flex flex-col items-center"
                style={{ width: '743px', height: '458.7px', gap: '80px' }}
            >
                {/* Ellipse + Content */}
                <div
                    className="flex flex-col items-center"
                    style={{ gap: '40px', width: '743px', height: '268.7px' }}
                >
                    {/* Ellipse */}
                    <div
                        className="rounded-full border-blue-500 border-[9.92px] bg-white rotate-90"
                        style={{
                            width: '144.7px',
                            height: '144.7px',
                        }}
                    />

                    {/* Content Text */}
                    <p
                        className="text-center"
                        style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '28px',
                            letterSpacing: '-1%',
                            width: '743px',
                            height: '84px',
                        }}
                    >
                        While you correctly formed several sentences, there are a couple of areas where improvement is needed.
                        Pay close attention to sentence structure and word placement to ensure clarity and correctness.
                        Review your responses below for more details.
                    </p>
                </div>

                {/* Go to Dashboard Button */}
                <button
                    className="border-2 border-blue-500 text-blue-500 bg-white px-6 py-2 rounded-lg hover:bg-blue-50"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default QuizEndedScreen