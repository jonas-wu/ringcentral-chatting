import React, { Component } from 'react'
import './style.css'

interface Props {
  
}
interface State {
  error: any;
  info: any;
}

export default class ErrorBoundary extends Component<Props, State> {
  state = {error: null, info: null}

  componentDidCatch(error: any, info: any) {
    console.log('componentDidCatch', error, info);
    this.setState({error, info})
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className='error-container'>
        <div className='error-message'>
          Something Error Ooccurring
          <span role="img" aria-label="face-emoji">
            😞
          </span>
        </div>
      </div>
    )
  }
}
