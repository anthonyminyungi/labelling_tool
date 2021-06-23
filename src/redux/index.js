import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';
import reducers from './actions';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  states: reducers,
});

const store = createStore(reducer, applyMiddleware(sagaMiddleware));
export default store;
sagaMiddleware.run(rootSaga);
