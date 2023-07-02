import React, {useEffect, useState} from 'react'

export default function Line() {
    

    //************************************************************/
    //******************** Node definition ********************/
    //************************************************************/
    class Node{
        density: number; //Density at a single node
        prev: Node[]; //Node closer to head
        //******************** Node Constructor ********************/
        constructor(density: number = 0.5){
            this.density = density;
            this.prev = [];
        }
    }
    //************************************************************/
    //******************** Line definition ********************/
    //************************************************************/
    class Line{
        tail: Node; //Node at end of line (forwardmost)
        //******************** Line Constructor ********************/
        //Creates an adjacency list of 'length' nodes
        constructor(length: number){
            if(length <= 0){ //Check length > 0
                throw new Error('Line length <= 0.');
            }
            this.tail = new Node(); //Initialize first node to be tail
            let oldNode = this.tail; //Temp Node variable to assign this node to next node's prev list
            for(let i=length-1; i>=1; i--){ //Create length - 2 nodes (after tail)
                let newNode = new Node(); //Create a node
                oldNode.prev.push(newNode); //Add backward node to new node's prev list
                oldNode = newNode; //Update temp Node var to newly created node
            }
        }
        //******************** getHead ********************/
        //returns the backwardmost node in calling 'Line' instance
        getHead(){
            let curNode = this.tail;
            this.iterAll(this.tail, (n) => {curNode = n})
            return curNode;
        }
        //******************** iterAll (Map) ********************/
        //Applies 'func' to each node in calling Line instance, beginning with 'curNode' (recursive)
        iterAll(curNode: Node, func: (n: Node) => void){
            func(curNode);
            if(!(curNode?.prev.length)){
                return;
            }
            for(const node of curNode?.prev){
                this.iterAll(node, func)
            }
        }
        //******************** drawLine ********************/
        //Returns list of rendered components
        //for each node in calling Line instance
        drawLine(){
            let nodeList: any[] = []; //list of node <div>s
            //Sequentially insert(0) divs for all nodes of calling Line into nodeList, ascending backward
            this.iterAll(this.tail, (n) => {
                nodeList.unshift( //Add new node div to front of div list
                    // New div for a single node
                    <div style={nodeStyle}> 
                        {/* Display numeric density of current node */}
                        {(n.density).toFixed(2)}
                    </div>)
            })
            return(
                // Container of list of node divs
                <div style={{display: "flex"}}>
                    {/* List of node divs */}
                    {nodeList} 
                </div>
            )
        }
        //******************** markovStep ********************/
        //Perform single iteration of markov transformation
        //to calling line instance
        markovStep(curNode: Node, nextNode: Node | null){
            
            
            let probMove : number = nextNode === null ? 1.0 : (1.0 - nextNode.density);
            let amountMove : number = probMove * curNode.density;
            if(nextNode !== null){
                nextNode.density += amountMove;
            }
            curNode.density -= amountMove;
            
            if(curNode?.prev.length <= 0){ //no more previous nodes, return
                return;
            }
            for(const node of curNode?.prev){ //recursive call for each previous connected node
                
                this.markovStep(node, curNode) //prev node new cur node. Just-processed node nextNode.
            }
        }
        

    }
    //************************************************************/
    //******************** Main ********************/
    //************************************************************/
    let line1 = new Line(10);
    const [lineList1, setLineList1] = React.useState(line1.drawLine());
    const [time, setTime] = useState(Date.now())
    useEffect(() => {
        const interval = setInterval(() => {
            //setTime(Date.now())
            setLineList1(line1.drawLine());
            line1.markovStep(line1.tail, null);

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
            {lineList1}
        </div>
    )
}
let nodeStyle = {width: "2em", 
                height: "2em", 
                display: "flex", 
                alignItems: "center", 
                border: "1px solid black"
            };
