export enum Dash_Astar_Heuristic {
    Manhatten,
    Manhattan,
    Euclidean,
    Chebyshev,
    Octile,
  }
  

export interface IDash_Astar_Node_Position {
    x: number
    y: number
}

export interface IDash_Astar_Node {
    position: IDash_Astar_Node_Position
    walkable?: boolean
}

export interface IDash_Astar_Grid_Settings {
    width: number
    height: number
    densityOfObstacles?: number
}

export interface IDash_AStar_Finder_Settings {
    grid: IDash_Astar_Grid_Settings
    diagonalAllowed?: boolean
    heuristic?: Dash_Astar_Heuristic
    weight?: number
    includeStartNode?: boolean
    includeEndNode?: boolean
}