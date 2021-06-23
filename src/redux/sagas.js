import { all, call, put, take, fork } from 'redux-saga/effects';
import { actions, types } from './actions';
import { getImageSource } from './api';

function* fetchBoardImage() {
  while (true) {
    yield take(types.REQUEST_BOARD_IMAGE);
    const image = yield call(getImageSource);
    yield put(actions.getBoardImage(image));
  }
}

function* watchFetchingBoardImage() {
  yield all([fork(fetchBoardImage)]);
}

export default function* rootSaga() {
  yield all([watchFetchingBoardImage()]);
}
