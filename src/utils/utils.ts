import { MsgType, MsgItem } from "../common/common";

let msgId: number = 0;

function newMessageId(): number {
  return msgId++;
}

export const newTestMessage = (type?: MsgType): MsgItem => {
  type = type || Math.floor(Math.random() * (MsgType.System + 1));
  let content;

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
  return {
    id: newMessageId(),
    content,
    type
  };
};

export function selectNode(node: Node):void {
  const select: Selection|null = window.getSelection()
  if (select) {
    if (select.rangeCount > 0) {
      select.removeAllRanges()
    }

    const range = document.createRange()
    range.selectNode(node)
    select.addRange(range)
  }    
}