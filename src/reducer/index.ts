import { AppState, MsgType } from "../common/types";
import { actionTypes } from "../action";
import { newMessage } from "../utils/utils";

let initState: AppState = {
  messages: [
    newMessage(MsgType.Text),
    newMessage(MsgType.System),
    newMessage(MsgType.Picture),
  ]
};

interface Action {
  type: string;
  [key:string]: any;
}

export default function reducer(state: AppState = initState, action: Action) {
  switch (action.type) {
    case actionTypes.SET_MESSAGES:
      return {...state, messages: action.messages};
    default:
      return state;
  }
}