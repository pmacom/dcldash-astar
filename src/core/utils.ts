import { IPathfinding_Grid_Position } from "./debug/interfaces"
import { Dash_Astar_Node } from "./node"

declare const Set: any

const toString = Object.prototype.toString

const getTag = (value: any) => {
    if(value == null) return value === undefined ? '[object Undefined]' : '[object Null]'
    return toString.call(value)
}

const isSymbol = (value: any) => {
    const type = typeof value
    return  type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

export const Dash_Astar_MinBy = (array: any[], iteratee:(value:any)=>void) => {
    let result: any
    let computed:number
    if(array == null) return null
    array.forEach(value => {
        const current = iteratee(value)
        if (current != null && (computed === undefined
            ? (current === current && !isSymbol(current))
            : (current < computed)
          )) {
            computed = current
            result = value
          }     
    })
    if(result) return result
}

export const Dash_Astar_Backtrace = (
    node: Dash_Astar_Node,
    includeStartNode: boolean,
    includeEndNode: boolean
    ) => {
    const path: number[][] = []
    let currentNode: Dash_Astar_Node | undefined = includeEndNode ? node : node.getParent()
    if(currentNode){
        while(currentNode!.getParent()){
            path.push([currentNode!.position.x, currentNode!.position.y])
            currentNode = currentNode!.getParent()
        }
    }
    if(includeStartNode){
        path.push([currentNode!.position.x, currentNode!.position.y])
    }
    return path.reverse()
}










// export const Dash_Astar_Get_Closest_GridPosition = (
//     position: Vector3
//     ): IPathfinding_Grid_Position => {
//     return {
//         x: Math.round(position.x),
//         y: Math.round(position.z),
//     }
// }

// export const Dash_Astar_Get_Closest_GridNode = (
//     position: Vector3
//     ): Dash_Astar_Node | undefined => {
//     return Dash_Pathfinding_State.getNode(`${Math.round(position.x-.5)},${Math.round(position.z-.5)}`)
// }

// export const Dash_Pathfinding_GridPosition_To_WorldPosition = (
//     gridPosition: IPathfinding_Grid_Position,
//     position: IPathfinding_Grid_Position,
//     yOffset: number = 0
//     ): Vector3 => {
//     const startX = 16*gridPosition.y
//     const startY = 16*gridPosition.x
//     return new Vector3(position.x+.5+startX, yOffset, position.y+.5+startY)
// }

// export const Dash_Pathfinding_Get_GridPositions_Within_Range = (
//     position: Vector2,
//     range: number = 5
// ) : typeof Set => {
//     const nodes = new Set()
//     for(let x=range*-1; x<range; x++){
//         for(let y=range*-1; y<range; y++){
//             const pos = `${position.x+x},${position.y+y}`
//             const node = Dash_Pathfinding_State.getNode(pos)
//             if(node) { nodes.add(pos) }
//         }
//     }
//     return nodes
// }

// export const Dash_Pathfinding_WorldPosition_To_GridPosition = (
//     position: Vector3
// ) => {

// }