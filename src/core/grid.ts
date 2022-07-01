import { Dash_Helpers_GetEntitiesWithComponent, Dash_OnUpdateFrame, Dash_OnUpdateFrame_Instance } from "dcldash"
import { IDash_Astar_Node_Position } from "./interfaces"
import { Dash_Astar_Node } from "./node"

declare const Set: any
declare const Map: any

class Dash_Astar_Grid_Instance {
    public initialized: boolean = false
    public width: number | undefined
    public height: number | undefined
    private nodes: typeof Map = new Map()

    private system: Dash_OnUpdateFrame_Instance
    public throttle: number = 1
    private timer: number = 0
    private occupiedSquares: typeof Set = new Set()

    constructor() {
        this.system = Dash_OnUpdateFrame.add((dt: number) => this.onTick(dt))
        this.system.start()
    }

    onTick(dt: number) {
        if ((this.timer += dt) >= this.throttle) {
            this.occupiedSquares.clear()
            let entities = Dash_Helpers_GetEntitiesWithComponent("Dash_Astar_Tile_Is_Occupied")
            entities.forEach(entity => {
                const position = this.getClosest_NodePosition_From_WorldPosition(
                    entity.getComponent(Transform).position
                )
                log({ position })
                this.occupiedSquares.add(`${position.x},${position.y}`)
            })
            this.timer = 0
        }
    }

    public create(width: number, height: number) {
        this.initialized = true
        this.width = width
        this.height = height
        this.nodes.clear()
        for (let x = 0; x < this.width!; x++) {
            for (let y = 0; y < this.height!; y++) {
                this.addNode(x, y, new Dash_Astar_Node({
                    position: { x, y } as IDash_Astar_Node_Position,
                    walkable: true
                }))
            }
        }
    }

    private addNode(x: number, y: number, node: Dash_Astar_Node) {
        this.nodes.set(`${x},${y}`, node)
    }

    public getNodeAt(x: number, y: number): (Dash_Astar_Node | undefined) {
        return this.nodes.get(`${x},${y}`)
    }

    public getIsWalkableAt(x: number, y: number): boolean {
        if(this.occupiedSquares.has(`${x},${y}`)) return false
        return this.getNodeAt(x, y)?.getIsWalkable() || false
    }

    public getIsOccupiedAt(x: number, y: number): boolean {
        return this.occupiedSquares.has(`${x},${y}`)
    }

    public setIsWalkableAt(x: number, y: number, isWalkable: boolean) {
        this.getNodeAt(x, y)?.setIsWalkable(isWalkable)
    }

    public isOnTheGrid(x: number, y: number): boolean {
        return (x >= 0 && x < this.width! && y >= 0 && y < this.height!)
    }

    public getSurroundingNodes(xPos: number, yPos: number, diagnalAllowed: boolean = true) {
        let surroundingNodes: typeof Set = new Set()
        for (let x = xPos - 1; x <= xPos + 1; x++) {
            for (let y = yPos - 1; y <= yPos + 1; y++) {
                log({ xPos, yPos, x, y })
                if (this.isOnTheGrid(x, y)) {
                    if (this.getIsWalkableAt(x, y)) {
                        if (diagnalAllowed) {
                            let node = this.getNodeAt(x, y)
                            surroundingNodes.add(node)
                        } else {
                            if (x == xPos || y == yPos) surroundingNodes.add(this.getNodeAt(x, y))
                        }
                    } else { continue }
                } else { continue }
            }
        }
        return surroundingNodes
    }

    public getClosest_NodePosition_From_WorldPosition(position: Vector3, includeOffset: boolean = false): IDash_Astar_Node_Position {
        return {
            x: Math.round(position.x) + (includeOffset ? .5 : 0),
            y: Math.round(position.z) + (includeOffset ? .5 : 0),
        }
    }

    // TODO: Check to see if this is an accurate clone or not
    // I suspect the value might be a reference and not a duplicate
    // If thats the case then when updating a cloned node, it would update the original
    // frownieface emoji
    public clone() { return new Map(this.nodes) }
    public getNodes(): typeof Set { return this.nodes }
    public resetGrid(): void { this.nodes.forEach((node: Dash_Astar_Node) => node.reset()) }
}

export const Dash_Astar_Grid = new Dash_Astar_Grid_Instance()