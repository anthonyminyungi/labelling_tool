import createReducer from './createReducer';

export const types = {
  SET_CURRENT_MENU: 'SET_CURRENT_MENU',
  REQUEST_BOARD_IMAGE: 'REQUEST_BOARD_IMAGE',
  GET_BOARD_IMAGE: 'GET_BOARD_IMAGE',
};

export const actions = {
  setCurrentMenu: currentMenu => ({
    type: types.SET_CURRENT_MENU,
    currentMenu,
  }),
  requestBoardImage: () => ({
    type: types.REQUEST_BOARD_IMAGE,
  }),
  getBoardImage: boardImage => ({
    type: types.GET_BOARD_IMAGE,
    boardImage,
  }),
};

const initialState = {
  currentMenu: 'SELECT',
  boardImage: {},
};

const reducers = createReducer(initialState, {
  [types.SET_CURRENT_MENU]: (state, action) =>
    (state.currentMenu = action.currentMenu),
  [types.GET_BOARD_IMAGE]: (state, action) =>
    (state.boardImage = action.boardImage),
});

export default reducers;
