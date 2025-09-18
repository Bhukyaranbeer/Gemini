import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import ContextProvider from './context/context';

const App = () => {
  return (
    <ContextProvider>
      <div className="app-wrapper">
        <Sidebar />
        <Main />
      </div>
    </ContextProvider>
  );
};

export default App;