import { Dash_Pathfinding_Debug_Controller } from "src/core/debug/debugController"
import { Dash_Astar_Finder } from "src/core/finder"
import { Dash_Astar_Grid } from "src/core/grid"
import { IDash_Astar_Node_Position } from "src/core/interfaces"
import { Dash_Astar_Node } from "src/core/node"
import { Dash_Astar_Messages } from "src/core/controllers/messages"

declare const Set: any

class Dash_Astar_State_Controller_Instance {

    createGrid(width: number, height: number){ Dash_Astar_Grid.create(width, height)}

    throwError(message: string){ throw(`Dash_Astar Error: ${message}`)}

    getNodeAt(x: number, y: number):(Dash_Astar_Node | undefined){
        if(!Dash_Astar_Grid.initialized) this.throwError(Dash_Astar_Messages.nogrid)
        return Dash_Astar_Grid.getNodeAt(x, y)
    }

    isWalkableAt(x: number, y: number): boolean | undefined {
        if(!Dash_Astar_Grid.initialized) this.throwError(Dash_Astar_Messages.nogrid)
        return Dash_Astar_Grid.getIsWalkableAt(x, y)
    }

    setIsWalkableAt(x: number, y: number, isWalkable: boolean){
        Dash_Astar_Grid.setIsWalkableAt(x, y, isWalkable)
    }

    isOnTheGrid(x: number, y: number): boolean | undefined {
        if(!Dash_Astar_Grid.initialized) this.throwError(Dash_Astar_Messages.nogrid)
        return Dash_Astar_Grid.isOnTheGrid(x, y)
    }

    getSurroundingNodes(x: number, y: number, diagnalAllowed?: boolean): typeof Set {
        if(!Dash_Astar_Grid.initialized) this.throwError(Dash_Astar_Messages.nogrid)
        return Dash_Astar_Grid.getSurroundingNodes(x, y, diagnalAllowed)
    }

    getNodesWithinRange(x: number, y: number, range: number = 2){
        const nodes = []
        for(let _x=range*-1; _x<range; _x++){
            for(let _y=range*-1; _y<range; _y++){
                if(Dash_Astar.isOnTheGrid(_x+x, _y+x)) nodes.push(Dash_Astar.getNodeAt(_x+x, _y+y))
            }
        }
        return nodes
    }

    getClosest_NodePosition_From_WorldPosition(position:Vector3): IDash_Astar_Node_Position {
        return Dash_Astar_Grid.getClosest_NodePosition_From_WorldPosition(position)
    }

    getClosest_Node_From_WorldPosition(position: Vector3): Dash_Astar_Node | undefined {
        return Dash_Astar_Grid.getNodeAt(
            Math.round(position.x)+.5,
            Math.round(position.y)+.5,
        )
    }

    getClosest_Node_From_NodePosition(position: IDash_Astar_Node_Position){
        return Dash_Astar_Grid.getNodeAt(
            Math.round(position.x)+.5,
            Math.round(position.y)+.5,
        )
    }

    findPath(startPosition: Vector3, endPosition: Vector3): number[][] {
        return Dash_Astar_Finder.findPath(startPosition, endPosition)
    }

    enableDebug(){
        if(Dash_Pathfinding_Debug_Controller) Dash_Pathfinding_Debug_Controller.enable()
    }
    disableDebug(){
        if(Dash_Pathfinding_Debug_Controller) Dash_Pathfinding_Debug_Controller.disable()
    }
}

export const Dash_Astar = new Dash_Astar_State_Controller_Instance()