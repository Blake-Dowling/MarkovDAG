import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import StateMain from './line'
import { State } from './line'
import { MarkovMatrix } from './line'

export default function App(){
        //     useEffect(() => {
            
        //     const interval = setInterval(() => {
    
        //         setStateList1(densityState.drawState());
        //         setMarkovMatrix(new MarkovMatrix(densityState.nodes.length));
        //         markovMatrix.markovCalc(densityState);
        //         markovMatrix.markovMult(densityState);
        //         setMarkovList(markovMatrix.markovDisplay());
    
        //     }, 1000);
        //     return () => {
        //         clearInterval(interval);
        //     };
        // }, []);
    //************************************************************/
    //******************** Main ********************/
    //************************************************************/
    //const[densityState, setDensityState] = React.useState(new State(10));


        const[densityState, setDensityState] = React.useState(null);
        console.log("--------")
        const [StateList1, setStateList1] = React.useState([]);
        const [markovMatrix, setMarkovMatrix] = useState([]);
        const [markovList, setMarkovList] = React.useState(null);



    return(
        <div>
            <StateMain 
                densityState={densityState}
                setDensityState={setDensityState}
                StateList1={StateList1}
                setStateList1={setStateList1}
                markovMatrix={markovMatrix}
                setMarkovMatrix={setMarkovMatrix}
                markovList={markovList}
                setMarkovList={setMarkovList}

            />
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));