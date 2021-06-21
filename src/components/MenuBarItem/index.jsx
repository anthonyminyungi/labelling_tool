import React from 'react';

import './style.scss';

const MenuBarItem = props => {
  const { icon } = props;
  return (
    <div className="menu-item">
      <img src={icon} alt="icon" />
    </div>
  );
};

export default MenuBarItem;
