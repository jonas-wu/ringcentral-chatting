import { MsgType, MsgItem } from "../common/types";

let msgId: number = 0;

function newMessageId(): number {
  return msgId++;
}

export const newMessage = (type?: MsgType, content?: string): MsgItem => {
  if (type === undefined) {
    type = Math.floor(Math.random() * (MsgType.System + 1));
  }
  
  if (content === undefined) {
    switch (type) {
      case MsgType.Text:
        content = "聊天消息 " + new Date().toTimeString();
        break;
      case MsgType.System:
        content = "系统消息 " + new Date().toTimeString();
        break;
      default:
        content = require("../img/view.jpg");
        break;
    }
  }
  
  return {
    id: newMessageId(),
    content: content || '',
    type
  };
};

export function selectNode(node: Node):void {
  const selection: Selection|null = window.getSelection()
  if (selection) {
    if (selection.rangeCount > 0) {
      selection.removeAllRanges()
    }

    const range = document.createRange()
    range.selectNode(node)
    selection.addRange(range)
  }    
}