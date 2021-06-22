import React from 'react';
import { Provider } from 'react-redux';

import { Header, MainContainer } from './components';
import './styles/index.scss';
import store from './redux';

function App() {
  return (
    <Provider store={store}>
      <React.Fragment>
        <Header />
        <MainContainer />
      </React.Fragment>
    </Provider>
  );
}

export default App;
