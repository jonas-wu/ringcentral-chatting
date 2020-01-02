import React, { Component } from 'react'
import { MenuItem } from '../../common/common'
import './style.css'

interface Props {
  posX: number;
  posY: number;
  menus: MenuItem[];
  clickMenu: (menu: MenuItem) => void;
}
interface State {
  
}


/**
 * 鼠标右键菜单
 *
 * @export
 * @class ContextMenu
 * @extends {Component<Props, State>}
 */
export default class ContextMenu extends Component<Props, State> {
  state = {}

  render() {
    const {menus, clickMenu, posX, posY} = this.props

    return (
      <ul className='context-menu-ul'
        style={{left: posX, top: posY}}
      >
        {menus.map(menu => (
          <li key={menu.type}
            onClick={() => clickMenu(menu)}
            className='context-menu-li'
          >
            {menu.text}
          </li>
        ))}
      </ul>
    )
  }
}
