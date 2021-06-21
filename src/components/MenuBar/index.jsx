import React from 'react';

import MenuBarItem from '../MenuBarItem';
import { createIcon, selectIcon } from '../../assets';
import './style.scss';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <MenuBarItem icon={selectIcon} />
      <MenuBarItem icon={createIcon} />
    </div>
  );
};

export default MenuBar;
