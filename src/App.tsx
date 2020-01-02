import React, {Component} from 'react';
import './App.css';
import Chat from './components/Chat';

interface Props {
  
}
interface State {
  
}

class App extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div className='app-container'>
        <Chat/>
      </div>
    )
  }
}

export default App
