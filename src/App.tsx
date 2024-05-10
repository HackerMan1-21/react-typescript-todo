import './App.css';
import { ToDoList } from './pages/ToDoList';
import { CommonTemplat } from './templates/CommonTemplate';

function App() {
  return (
    <div className="App">
      <CommonTemplat>
        <ToDoList />
      </CommonTemplat>
    </div>
  );
}

export default App;
