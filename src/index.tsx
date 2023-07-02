import React from 'react'
import ReactDOM from 'react-dom'
import Line from './line'

export default function App(){
    return(
        <div>
            <Line/>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));