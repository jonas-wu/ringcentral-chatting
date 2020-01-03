import React, { Component } from "react";
import { Button } from "antd";
import "./style.css";
import {
  MsgItem,
  MsgType,
  MenuItem,
  MenuType,
  AppState
} from "../../common/types";
import ContextMenu from "../ContextMenu";
import { connect } from "react-redux";
import { setMessages } from "../../action";
import { selectNode, newMessage } from "../../utils/utils";

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

const menus: MenuItem[] = [{ type: MenuType.Undo, text: "撤销" }];

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
    menuPosY: 0
  };

  containerRef: React.RefObject<HTMLTableSectionElement> = React.createRef();
  inputRef: React.RefObject<HTMLDivElement> = React.createRef();

  handleContextMenu = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    msg: MsgItem
  ) => {
    e.preventDefault();

    if (msg.type === MsgType.System) return;

    selectNode(e.currentTarget as Node);

    this.setState({
      contextMenuVisible: true,
      menuPosX: e.clientX + 10,
      menuPosY: e.clientY - (this.containerRef.current?.offsetTop || 0),
      curMsg: msg
    });
  };

  handleClickMenu = (menu: MenuItem) => {
    if (menu.type === MenuType.Undo) {
      const { messages, setMessages } = this.props;
      const newMessags = messages.filter(
        msg => msg.id !== this.state.curMsg?.id
      );
      this.setState({ contextMenuVisible: false });
      setMessages([...newMessags]);
    }
  };

  sendMessage = () => {
    const nodes = this.inputRef.current?.childNodes || [];
    if (nodes.length === 0) return;

    let textContent: string = "";
    const messages:MsgItem[] = []

    for (let i = 0; i < nodes.length; i++) {
      // image
      if (nodes[i] instanceof HTMLImageElement) {
        if (textContent) {
          const s = textContent.slice(0, textContent.length - 1);
          messages.push(newMessage(MsgType.Text, s));
          textContent = '';
        }
        messages.push(newMessage(MsgType.Picture, (nodes[i] as HTMLImageElement).src))
      } else {
        // text
        textContent += nodes[i].textContent + '\n'
      }
    }

    if (textContent) {
      const s = textContent.slice(0, textContent.length - 1);
      messages.push(newMessage(MsgType.Text, s));
    }

    this.props.setMessages([...this.props.messages, ...messages])

    if (this.inputRef.current) {
      this.inputRef.current.innerHTML = '';
    }

    setTimeout(() => {
      const container = this.containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 50);
  };

  handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const items = e.clipboardData.items;

    for (let i = 0, len = items.length; i < len; i++) {
      if (items[i].type.includes("image")) {
        const pasteFile = items[i].getAsFile();
        if (pasteFile?.size === 0) return;
        
        const fileUrl = URL.createObjectURL(pasteFile)
        
        const img = new Image();
        img.src = fileUrl;
        ((e.target) as HTMLDivElement).appendChild(img)
      }
    };
  }

  handleInputKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey && e.key === 'Enter') {
      e.preventDefault()
      this.sendMessage()
    }
  }

  componentDidMount() {
    const inputEle = this.inputRef.current;
    if (inputEle) {
      inputEle.appendChild(new Text('prefix'))

      const img = new Image()
      img.src = require('../../img/view.jpg')
      inputEle.appendChild(img)

      inputEle.appendChild(new Text('suffix'))
    }
  }

  getMsgView = (msg: MsgItem) => {
    if (msg.type === MsgType.Picture) {
      return <img className="message-img" alt="pic" src={msg.content} />
    }

    if (msg.type === MsgType.System) {
      return (
        <div className="message-item-system" >
          {msg.content}
        </div>
      )
    }

    return (
      <div className="message-item-text">
        {msg.content.split("\n").map((x, i) => (
          <div key={i}>{x}</div>
        ))}
      </div>
    )
  }

  render() {
    const { messages } = this.props;
    const { menuPosX, menuPosY } = this.state;

    return (
      <div>
        <section
          className="message-container"
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          ref={this.containerRef}
          onClick={() => this.setState({ contextMenuVisible: false })}
        >
          <div style={{ flex: 1 }}></div>
          <ul style={{ listStyle: "none" }}>
            {messages.map(msg => (
              <li
                key={msg.id}
                onContextMenu={e => this.handleContextMenu(e, msg)}
              >
                {this.getMsgView(msg)}
              </li>
            ))}
          </ul>

          {this.state.contextMenuVisible && (
            <ContextMenu
              menus={menus}
              posX={menuPosX}
              posY={menuPosY}
              clickMenu={this.handleClickMenu}
            />
          )}
        </section>
        <section className="message-input-container">
          <div
            contentEditable={true}
            className="message-input"
            ref={this.inputRef}
            onPaste={this.handlePaste}
            onKeyDown={this.handleInputKey}
          />

          <Button className="message_send_btn" onClick={this.sendMessage}>
            发送(Alt+Enter)
          </Button>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  messages: state.messages
});

const mapDispatchToProps = (dispatch: any) => ({
  setMessages: (messages: MsgItem[]) => dispatch(setMessages(messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
