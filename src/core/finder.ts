import { Dash_Astar_Heuristic, IDash_AStar_Finder_Settings } from "./interfaces";
import { Dash_Astar_Grid } from "./grid";
import { calculateHeuristic } from "./heuristic"
import { IDash_Astar_Node_Position } from "./interfaces";
import { Dash_Astar_Backtrace, Dash_Astar_MinBy } from "./utils";
import { Dash_Astar_Node } from "./node";
import { Dash_Pathfinding_Debug_Controller } from "./debug/debugController";
import { Dash_Pathfinding_Debug_Entity } from "./debug/debugEntity";

declare const Set: any

class Dash_Astar_Finder_Instance {
    private clist: typeof Set = new Set()
    private olist: typeof Set = new Set()

    private weight: number = 1
    private heuristic: Dash_Astar_Heuristic = Dash_Astar_Heuristic.Chebyshev
    readonly diagnalAllowed: boolean | undefined
    readonly includeStartNode: boolean = true
    readonly includeEndNode: boolean = true
    
    constructor(){}

    public findPath(
        startPosition: Vector3,
        endPosition: Vector3): number[][] {

        this.clist.clear()
        this.olist.clear()
        Dash_Astar_Grid.resetGrid()

        const startNode = Dash_Astar_Grid.getNodeAt(startPosition.x, startPosition.z)
        const endNode = Dash_Astar_Grid.getNodeAt(endPosition.x, endPosition.z)

        log({ startNode, endNode })

        let s = Dash_Pathfinding_Debug_Controller.nodeEntities.get(`${startNode?.position.x},${startNode?.position.y}`) as Dash_Pathfinding_Debug_Entity
        let e = Dash_Pathfinding_Debug_Controller.nodeEntities.get(`${endNode?.position.x},${endNode?.position.y}`) as Dash_Pathfinding_Debug_Entity

        // s.setIsStartPoint()
        // e.setIsEndPoint()

        if(!startNode
          || !endNode
          || !Dash_Astar_Grid.getIsWalkableAt(endPosition.x, endPosition.z)
          || !Dash_Astar_Grid.getIsWalkableAt(startPosition.x, startPosition.z)
        ){return []}

        startNode.setIsOnOpenList(true)
        this.olist.add(startNode)

        for(let x=0; x<Dash_Astar_Grid.width!; x++ ){
            for(let y=0; y<Dash_Astar_Grid.height!; y++){
                let node = Dash_Astar_Grid.getNodeAt(x, y)
                
                if(node){
                    if(!Dash_Astar_Grid.getIsWalkableAt(x, y)){
                        node.resetFGH()
                        node.setIsOnClosedList(true)
                        this.clist.add(node)
                    }else{
                        const heuristic = calculateHeuristic(
                            this.heuristic,
                            node.position,
                            endNode.position,
                            this.weight
                        )
                        node.setHValue(heuristic)
                    }
                }
            }
        }

        while(this.olist.size !== 0){
            const currentNode = Dash_Astar_MinBy(this.olist, (o) => o.getFValue())

            currentNode.setIsOnOpenList(false)
            this.olist.delete(currentNode)

            currentNode.setIsOnClosedList(true)
            this.clist.add(currentNode)

            if(currentNode === endNode){
                return Dash_Astar_Backtrace(
                    endNode,
                    this.includeStartNode,
                    this.includeEndNode
                )
            }

            const neighbors = Dash_Astar_Grid.getSurroundingNodes(
                currentNode.position.x,
                currentNode.position.y,
                this.diagnalAllowed
            )

            log('neighbors', neighbors.size)

            neighbors.forEach((neighbor: Dash_Astar_Node) => {
                if(neighbor.getIsOnClosedList()){ return }

                const nextGValue = currentNode.getGValue() +
                  (neighbor.position.x !== currentNode.position.x ||
                  neighbor.position.y! == currentNode.position.y
                  ? this.weight
                  : this.weight * 1.41421)

                if (!neighbor.getIsOnOpenList() || nextGValue < neighbor.getGValue()) {
                    neighbor.setGValue(nextGValue)
                    neighbor.setParent(currentNode)
          
                    if (!neighbor.getIsOnOpenList()) {
                        neighbor.setIsOnOpenList(true)
                        this.olist.add(neighbor)
                    } else {
                        neighbor.setParent(currentNode)
                    }
                }
            })
        }

        return[]
    }
}

export const Dash_Astar_Finder = new Dash_Astar_Finder_Instance()