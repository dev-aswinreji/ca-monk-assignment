import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Questions from './components/questions/questions';
import data from './json-data/sample';
import Home from './pages/home/home';

function App() {
  return (
    <>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/questions' element={<Questions data={data.data} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
