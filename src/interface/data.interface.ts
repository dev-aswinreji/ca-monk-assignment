export default interface Data {
    testId: string;
    questions: Questions[];
}
interface Questions {
    questionId: string;
    question: string;
    questionType: string;
    answerType: string;
    options: string[];
    correctAnswer: string[];
}
