import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import VerifyBot from './component/verify-bot';
import Home from "./component/home";
import DashBoard from './component/dashboard';
import CreatePaperRoute from './component/CreatePaperRoute';
import ModifyPaperRoute from './component/ModifyPaperRoute';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Routes>
        <Route path="/paper-route/" element={<Home />} />
        <Route path="/paperroute/" element={<Home />} />
        <Route path="/paper-route/Dashboard" element={<DashBoard />} />
        <Route path="/paper-route/Modify" element={<ModifyPaperRoute />} />
        <Route path="/paper-route/Create" element={<CreatePaperRoute />} />
        </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
