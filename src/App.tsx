import './App.css';
import Questions from './components/questions/questions';
import data from './json-data/sample';

function App() {
  return (
    <>
      {/* <Home /> */}
      <Questions data={data.data} />
    </>
  );
}

export default App;
