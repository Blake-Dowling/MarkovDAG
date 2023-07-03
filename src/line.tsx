import React, {useEffect, useState} from 'react'


export default function State() {
    useEffect(() => {
        const interval = setInterval(() => {
            setStateList1(state.drawState());
            setMarkovMatrix(new MarkovMatrix(state.nodes.length));
            markovMatrix.markovCalc(state);
            markovMatrix.markovMult(state);
            setMarkovList(markovMatrix.markovDisplay());

            

        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    //************************************************************/
    //******************** Markov matrix definition ********************/
    //************************************************************/
    class MarkovMatrix{
        width: number;
        height: number;
        matrix: number[][] = [];
        constructor(size: number){
            this.width = size;
            this.height = size;
            for(let i=0; i<size; i++){
                let newRow = Array(size).fill(0.0);
                this.matrix.push(newRow);
            }

        }
        setProb(from: number, to: number, prob: number): void{
            this.matrix[to][from] = prob;
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
            if(state.nodes.length !== this.width){ //check matrix side = state length
                throw new Error("Markov matrix width and height must equal state length.");
            }
            //******************** Matrix Multiplication ********************/
            let oldDensities = Array(state.nodes.length).fill(0.0); 
            for(let i=0; i<state.nodes.length; i++){ //copy of old densities state
                oldDensities[i] = state.nodes[i].density;
            }
            let newDensities :any[]= []//Array(oldDensities.length).fill(0.0); //new densities state
            for(let row=0; row<this.matrix.length; row++){
                let newDensity = 0.0;
                for(let col=0; col<this.matrix[row].length; col++){
                    
                    //newDensities[row] += oldDensities[row] * this.matrix[row][col];
                    newDensity += oldDensities[row] * this.matrix[row][col];
                    console.log("-------")
                    console.log(this.matrix[row])
                    //console.log(newDensities[row]);
                }
                newDensities.push(newDensity);
                //console.log(newDensities)
            }

            //******************** Copy new state ********************/
            setState((prevState) => {
                let newState = new State(prevState.nodes.length);
                newState.nodes = prevState.nodes;
                for(let i=0; i<prevState.nodes.length; i++){ //Copy new state densities to old state
                    newState.nodes[i].density = newDensities[i];
                    
                }
                
                return (newState)
            });
            
            
        }
        markovDisplay(){
            let probList: any[] = [];
            for(const row of this.matrix){
                probList.push(
                    <div>
                        {row.map((prob) => {
                            return (
                                <div style={nodeStyle}>
                                    {prob.toFixed(2)}
                                </div>
                            )
                        })}
                    </div>
                );
            }
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
        constructor(density: number = 0.4){
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
    const[state, setState] = React.useState(() => {
        const initialState = new State(10);
        return initialState;
    }
        );

    //setState(new State(10))
    const [StateList1, setStateList1] = React.useState(state.drawState());
    
    const [markovMatrix, setMarkovMatrix] = useState(new MarkovMatrix(state.nodes.length));

    const [markovList, setMarkovList] = React.useState(markovMatrix.markovDisplay());

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