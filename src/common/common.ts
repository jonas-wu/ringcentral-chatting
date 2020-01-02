export enum MsgType {
  Text,
  Picture,
  System
}

export interface MsgItem {
  id: number;
  content: string;
  type: MsgType;
}

export interface AppState {
  messages: MsgItem[];
}

export enum MenuType {
  Undo,
}

export interface MenuItem {
  type: MenuType;
  text: string;
}