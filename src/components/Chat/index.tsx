import React, { Component } from 'react'
import './style.css'
import { MsgItem, MsgType, MenuItem, MenuType, AppState } from '../../common/common'
import ContextMenu from '../ContextMenu'
import { connect } from 'react-redux'
import { setMessages } from '../../action'
import { newTestMessage, selectNode } from '../../utils/utils'

interface Props {
  messages: MsgItem[];
  setMessages: (messages: MsgItem[]) => void;
}
interface State {
  contextMenuVisible: boolean;
  menuPosX: number;
  menuPosY: number;
  curMsg?: MsgItem;
}

const menus: MenuItem[] = [{type: MenuType.Undo, text: '撤销'}]


/**
 * 消息列表
 *
 * @class Chat
 * @extends {Component<Props, State>}
 */
class Chat extends Component<Props, State> {
  state: State = {
    contextMenuVisible: false,
    menuPosX: 0,
    menuPosY: 0,
  }
  containerRef: React.RefObject<HTMLDivElement> = React.createRef()

  timer: any;
  curMsgId: number = -1;

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.setMessages([...this.props.messages, newTestMessage()])
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  handleContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, msg: MsgItem) => {
    e.preventDefault()

    if (msg.type === MsgType.System) return;

    selectNode(e.target as Node)

    this.setState({
      contextMenuVisible: true, 
      menuPosX: e.clientX + 10, 
      menuPosY: e.clientY - (this.containerRef.current?.offsetTop || 0),
      curMsg: msg,
    })
  }

  clickMenu = (menu: MenuItem) => {
    if (menu.type === MenuType.Undo) {
      const {messages, setMessages} = this.props
      const newMessags = messages.filter((msg) => msg.id !== this.state.curMsg?.id)
      this.setState({contextMenuVisible: false})
      setMessages([...newMessags])
    }
  }

  render() {
    const {messages} = this.props
    const {menuPosX, menuPosY} = this.state

    return (
      <div className='message-container'
        onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
        ref={this.containerRef}
        onClick={() => this.setState({contextMenuVisible: false})}
      >
        <div style={{flex: 1}}></div>
        <ul style={{listStyle: 'none'}}>
          {messages.map(msg => (
            <li key={msg.id} onContextMenu={(e) => this.handleContextMenu(e, msg)}>
              {
                msg.type === MsgType.Picture ? (
                  <img className='message-img' alt='pic' src={msg.content}/>
                ) : (
                  <div className='message-item'
                    style={msg.type === MsgType.System ? {color: 'gray'} : {}}
                  >
                    { msg.content }
                  </div>
                )
              }
            </li>
          ))}
        </ul>
        
        {this.state.contextMenuVisible && 
          <ContextMenu
            menus={menus}
            posX={menuPosX}
            posY={menuPosY}
            clickMenu={this.clickMenu}
          />}
      </div>
    )
  }
}

const mapStateToProps = (state:AppState) => ({
  messages: state.messages,
})

const mapDispatchToProps = (dispatch: any) => ({
  setMessages: (messages: MsgItem[]) => dispatch(setMessages(messages))
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)