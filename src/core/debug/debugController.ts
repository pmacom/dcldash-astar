import { Dash_OnUpdateFrame, Dash_OnUpdateFrame_Instance } from "dcldash"
import { IPathfinding_Grid_Position } from "./interfaces"
import { Dash_Astar_Grid } from "../grid"
import { Dash_Astar_Node } from "../node"
import { Dash_Pathfinding_Debug_Entity } from "./debugEntity"
import { Dash_Pathfinding_Get_Closest_GridPosition } from "../helpers"

declare const Map: any
declare const Set: any

class Dash_Pathfinding_Debug_Controller_Instance {
    private onUpdate: Dash_OnUpdateFrame_Instance
    private throttle: number = .3
    private timer: number = 0
    private range: number = 10
    private initialized: boolean = false
    public nodeEntities: typeof Map | undefined

    constructor(){
        this.onUpdate = Dash_OnUpdateFrame.add((dt: number) => this.onFrame(dt))
    }

    enable(){
        if(!this.initialized) this.generateEntities()
        this.onUpdate.start()
    }
    disable(){this.onUpdate.stop()}
    setRange(range: number){ this.range = range }

    generateEntities(){
        this.nodeEntities = new Map()
        Dash_Astar_Grid.getNodes().forEach((node: Dash_Astar_Node, pos: string) => {
            this.nodeEntities.set(pos, new Dash_Pathfinding_Debug_Entity(node))
        })
    }

    onFrame(dt: number){
        this.timer+=dt
        if(this.timer >= this.throttle){
            const userPosition = Dash_Pathfinding_Get_Closest_GridPosition(Camera.instance.feetPosition)
            const nearbyEntities = this.getPositionsWithinRange(userPosition.x, userPosition.y, this.range) as typeof Set
            this.nodeEntities.forEach((entity: Dash_Pathfinding_Debug_Entity, pos: string) => {
                entity.setWalkable(entity.node.getIsWalkable())
                entity.setIsOccupied(Dash_Astar_Grid.getIsOccupiedAt(entity.x, entity.y))
               // log('iSoccupied', Dash_Astar_Grid.getIsOccupiedAt(entity.x, entity.y))
                if(nearbyEntities.has(pos)){ entity.show() } else { entity.hide() }
            })
            this.timer = 0;
        }
    }

    getPositionsWithinRange(posX: number, posY: number, range: number = this.range){
        const nodes = new Set()
        for(let x=range*-1; x<range; x++){
            for(let y=range*-1; y<range; y++){
                const pos = `${posX+x},${posY+y}`
                if(this.nodeEntities.has(pos)) nodes.add(pos)
            }
        }
        return nodes
    }

    getEntitiesWithinRange(position: IPathfinding_Grid_Position, range: number = this.range){
        const nodes = new Set()
        for(let x=range*-1; x<range; x++){
            for(let y=range*-1; y<range; y++){
                const pos = `${position.x+x},${position.y+y}`
                const node = this.nodeEntities.get(pos)
                if(node){nodes.add(pos)}
            }
        }
        return nodes
    }
}

export const Dash_Pathfinding_Debug_Controller = new Dash_Pathfinding_Debug_Controller_Instance()