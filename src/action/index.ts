import { MsgItem } from "../common/types"

export const actionTypes = {
  SET_MESSAGES: 'SET_MESSAGES',
  GET_MESSAGES: 'GET_MESSAGES'
}

export const setMessages = (messages: MsgItem[]) => {
  return (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_MESSAGES,
      messages,
    })
  }
}
