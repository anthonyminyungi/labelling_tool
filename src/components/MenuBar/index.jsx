import React from 'react';

import MenuBarItem from '../MenuBarItem';
import { createIcon, selectIcon } from '../../assets';
import './style.scss';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <MenuBarItem id="select" icon={selectIcon} />
      <MenuBarItem id="create" icon={createIcon} />
    </div>
  );
};

export default MenuBar;
