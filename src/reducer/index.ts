import { AppState, MsgType } from "../common/common";
import { actionTypes } from "../action";
import { newTestMessage } from "../utils/utils";

let initState: AppState = {
  messages: [
    newTestMessage(MsgType.Text),
    newTestMessage(MsgType.System),
    newTestMessage(MsgType.Picture),
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