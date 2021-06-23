import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MenuBar from '../MenuBar';
import Board from '../Board';
import { actions } from '../../redux/actions';
import './style.scss';

const MainContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.requestBoardImage());
  }, [dispatch]);

  return (
    <div className="main-container">
      <MenuBar />
      <Board />
    </div>
  );
};

export default MainContainer;
