import { Dash_Astar_Node } from "src/core/node";
import { Dash_Pathfinding_Debug_Entity } from "./debugEntity";

export interface IPathfinding_Debug_Grid {
    entity?: Dash_Pathfinding_Debug_Entity,
    node: Dash_Astar_Node,
}

export interface IPathfinding_Grid_Position {
    x: number,
    y: number,
}

export interface IPathfinding_Layout_Data {
    walls: IPathfinding_Grid_Position[]
}