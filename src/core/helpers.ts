import { IPathfinding_Grid_Position } from "src/core/debug/interfaces"

export const Dash_Pathfinding_Get_Closest_GridPosition = (
    position: Vector3
    ): IPathfinding_Grid_Position => {
    return {
        x: Math.round(position.x),
        y: Math.round(position.z),
    }
}