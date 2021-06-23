import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './style.scss';
import { getCurrentMenu } from '../../redux/selectors';
import { actions } from '../../redux/actions';

const MenuBarItem = props => {
  const dispatch = useDispatch();
  const { id, icon } = props;

  const currentMenu = useSelector(state => getCurrentMenu(state));

  const handleClick = useCallback(() => {
    if (id.toUpperCase() !== currentMenu) {
      dispatch(actions.setCurrentMenu(id.toUpperCase()));
    }
  }, [currentMenu, dispatch, id]);

  return (
    <div
      className={`menu-item${
        id.toUpperCase() === currentMenu ? ' selected' : ''
      }`}
      onClick={handleClick}
    >
      <img src={icon} alt="icon" />
    </div>
  );
};

export default MenuBarItem;
