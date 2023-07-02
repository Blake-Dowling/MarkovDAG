import React, {useEffect, useState} from 'react'

export default function State() {
    //************************************************************/
    //******************** Markov matrix definition ********************/
    //************************************************************/
    class MarkovMatrix{
        size: number;
        matrix: number[][] = [[]];
        constructor(size: number){
            this.size = size;
            this.matrix = Array(size**2).fill(0.0)
        }
        setProb(from: number, to: number, prob: number): void{
            let toIndex: number = from + this.size*to;
            this.matrix[from][to] = prob;
        }

        //******************** markovCalc ********************/
        //Perform single iteration of markov transformation
        //to calling State instance
        markovCalc(state: State): void{
            for(const curNode of state.nodes){
                let fromIndex: number = state.nodes.indexOf(curNode);
                for(const toNode of curNode.next){
                    let probTo: number = Math.max(0,(1.0 - toNode.density));
                    let probFrom: number = 1.0 - probTo;
                    let toIndex: number = state.nodes.indexOf(toNode);
                    this.setProb(fromIndex, toIndex, probTo);
                    this.setProb(fromIndex, fromIndex, probFrom);
                }
            }
        }
        markovMult(state: State): void{
            //******************** Check matrix side length = state length ********************/
            let stateLength: number = state.nodes.length; //length of state
            let matrixSideLength: number = this.matrix.length / stateLength; //width/height of matrix
            if(matrixSideLength !== stateLength){ //check matrix side = state length
                throw new Error("Markov matrix width and height must equal state length.");
            }
            //******************** Matrix Multiplication ********************/
            let oldState = Array(state.nodes.length).fill(0.0); //copy of old densities state
            for(let i=0; i<state.nodes.length; i++){
                oldState[i] = state.nodes[i].density;
            }
            let newState = Array(stateLength).fill(0.0); //new densities state

            for(let row=0; row<matrixSideLength; row++){ //loop over each matrix row
                let matrixRowIndex = matrixSideLength * row; //matrix index of row[0]
                for(let i=matrixRowIndex; i<matrixRowIndex+matrixSideLength; i++){ //loop over matrix row
                    newState[row] += oldState[row] * this.matrix[i]; //dot current row index to new state
                }
            }
            for(let i=0; i<state.nodes.length; i++){ //Copy new state densities to old state
                state.nodes[i].density = newState[i];
            }
        }
        markovDisplay(){
            let probList: any[] = [];
            this.matrix.map((prob, i) => {
                probList.push(
                    <div>
                        <div style={nodeStyle}>
                            {prob.toFixed(2)}
                        
                        (i % Math.trunc(Math.sqrt(this.matrix.length)) === 0) && </div><div>
                        </div>
                    </div>
                );
            });
            return(
                // Container of list of node divs
                <div style={{display: "flex"}}>
                    {/* List of node divs */}
                    {probList} 
                </div>
            )
        }
    }
    //************************************************************/
    //******************** Node definition ********************/
    //************************************************************/
    class Node{
        density: number; //Density at a single node
        next: Node[]; //Node closer to head
        //******************** Node Constructor ********************/
        constructor(density: number = 0.5){
            this.density = density;
            this.next = [];
        }
    }
    //************************************************************/
    //******************** State definition ********************/
    //************************************************************/
    class State{
        nodes: Node[]; //List of all nodes
        heads: Node[]; //Node at end of State (forwardmost)
        //******************** State Constructor ********************/
        //Creates an adjacency list of 'length' nodes
        constructor(length: number){
            if(length < 0){ //Check length < 0
                throw new Error('State length <= 0.');
            }
            this.nodes = [];
            this.heads = []; //Initialize heads to empty array if length is 0.
            if(length > 0){ //Check length > 0
                let initialNode = new Node(); //Create initial node (will be initial tail)
                this.nodes.push(initialNode);
                this.heads.push(initialNode); //Initialize first node to be a tail
                let oldNode = initialNode; //Temp Node variable to assign this node to next node's next list
                for(let i=length-1; i>=1; i--){ //Create length - 2 nodes (after tail)
                    let newNode = new Node(); //Create a node
                    this.nodes.push(newNode);
                    oldNode.next.push(newNode); //Add backward node to new node's next list
                    oldNode = newNode; //Update temp Node var to newly created node
                }
            }
            
        }
        //******************** iterAll (Map) ********************/
        //Applies 'func' to each node in calling State instance, beginning with 'curNode' (recursive)
        // iterAll(curNode: Node, func: (n: Node) => void){
        //     func(curNode);
        //     if(!(curNode?.next.length)){
        //         return;
        //     }
        //     for(const node of curNode?.next){
        //         this.iterAll(node, func)
        //     }
        // }
        //******************** drawState ********************/
        //Returns list of rendered components
        //for each node in calling State instance
        drawState(){
            let nodeList: any[] = []; //list of node <div>s
            //Sequentially insert(0) divs for all nodes of calling State into nodeList, ascending backward
            this.nodes.map((node) => {
                nodeList.push(
                    // New div for a single node
                    <div style={nodeStyle}> 
                        {/* Display numeric density of current node */}
                        {(node.density).toFixed(2)}
                    </div>
                )
            });
            return(
                // Container of list of node divs
                <div style={{display: "flex"}}>
                    {/* List of node divs */}
                    {nodeList} 
                </div>
            )
        }

        

    }
    //************************************************************/
    //******************** Main ********************/
    //************************************************************/
    const[state, setState] = React.useState(new State(10));
    
    const [StateList1, setStateList1] = React.useState(state.drawState());
    
    const [markovMatrix, setMarkovMatrix] = useState(new MarkovMatrix(state.nodes.length));

    const [markovList, setMarkovList] = React.useState(markovMatrix.markovDisplay());
    useEffect(() => {
        const interval = setInterval(() => {
            //setTime(Date.now())
            setStateList1(state.drawState());
            setMarkovMatrix(new MarkovMatrix(state.nodes.length));
            markovMatrix.markovCalc(state);
            markovMatrix.markovMult(state);
            setMarkovList(markovMatrix.markovDisplay());
            //console.log(markovMatrix.matrix);
            // for(const tail of state.heads){
            //     state.markovReset(tail);
            // }
            // for(const tail of state.heads){
            //     state.markovCalc(tail, null);
            // }
            

        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    //************************************************************/
    //******************** Render ********************/
    //************************************************************/
    return (
        <div style={{display: "flex"}}>
            {StateList1}
            <br/>
            {markovList}
        </div>
    )
}
let nodeStyle = {width: "2em", 
                height: "2em", 
                display: "flex", 
                alignItems: "center", 
                border: "1px solid black"
            };
