
import { Button } from '@/components/ui/button';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate()
    function handleStart() {
        navigate("/questions")
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
                {/* Title and Description */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Sentence Construction</h1>
                    <p className="text-lg text-gray-400 mb-4">
                        Select the words to complete the sentence by arranging <br />
                        the provided options in the right order.
                    </p>
                </div>

                {/* Details Section */}
                <div className="flex flex-wrap justify-center items-center gap-4 text-center text-gray-700">
                    <div className="px-4">
                        <h2 className="font-semibold">Time Per Question</h2>
                        <p>30 sec</p>
                    </div>

                    <span className="text-gray-300 text-xl">|</span>

                    <div className="px-4">
                        <h2 className="font-semibold">Total Questions</h2>
                        <p>10</p>
                    </div>

                    <span className="text-gray-300 text-xl">|</span>

                    <div className="px-4">
                        <h2 className="font-semibold">Coins</h2>
                        <p className="flex items-center justify-center">
                            <AiOutlineDollarCircle className="mr-2 text-xl" />
                            0
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                    <Button className="bg-white text-blue-500 border border-blue-500 px-12">
                        Back
                    </Button>
                    <Button className="bg-blue-500 text-white px-12" onClick={handleStart}>
                        Start
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Home