import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Questions from './components/questions/questions';
import data from './json-data/sample';
import Home from './pages/home/home';
import QuizReviewScreen from './components/output/quizEnded';

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/questions' element={<Questions data={data.data} />} />
          <Route path='/ended' element={<QuizReviewScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
