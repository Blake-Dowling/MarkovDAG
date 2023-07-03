import React from 'react'
import ReactDOM from 'react-dom'
import State from './line'

export default function App(){
    return(
        <div>
            <State/>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));