import createReducer from './createReducer';

export const types = {
  SET_CURRENT_MENU: 'SET_CURRENT_MENU',
};

export const actions = {
  setCurrentMenu: currentMenu => ({
    type: types.SET_CURRENT_MENU,
    currentMenu,
  }),
};

const initialState = {
  currentMenu: 'SELECT',
};

const reducers = createReducer(initialState, {
  [types.SET_CURRENT_MENU]: (state, action) =>
    (state.currentMenu = action.currentMenu),
});

export default reducers;
