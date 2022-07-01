import { Dash_Material } from "dcldash"
import { Dash_Pathfinding_Debug_Entity_Component } from "../components"
import { Dash_Astar_Node } from "../node"

const BlockingMaterial = new Material()
BlockingMaterial.albedoColor = Color3.Black()

const WalkingMaterial = new Material()
WalkingMaterial.albedoColor = Color3.Blue()

const IsStartPointMaterial = new Material()
IsStartPointMaterial.albedoColor = Color3.Green()

const IsEndPointMaterial = new Material()
IsEndPointMaterial.albedoColor = Color3.Red()

const IsPathMaterial = new Material()
IsPathMaterial.albedoColor = Color3.Yellow()

export class Dash_Pathfinding_Debug_Entity extends Entity {
    private isOccupiedVisual: Entity = new Entity()
    public isWalkable: boolean
    public x: number
    public y: number

    constructor(public node: Dash_Astar_Node){
        super()
        this.isWalkable = node.getIsWalkable()
        this.x = node.position.x
        this.y = node.position.y

        this.addComponent(new PlaneShape())
        this.addComponent(new Transform({
            position: new Vector3(this.x+.5, .15, this.y+.5),
            rotation: new Quaternion().setEuler(90,0,0),
            scale: new Vector3().setAll(.95)
        }))
        this.addComponent(new Dash_Pathfinding_Debug_Entity_Component())
        this.addComponent(this.isWalkable ? Dash_Material.Blue(): Dash_Material.Black())

        const shape = new PlaneShape()
        shape.withCollisions = false
        this.isOccupiedVisual.addComponent(shape)
        this.isOccupiedVisual.addComponent(new Transform({
            position: new Vector3(0,0,-.05),
            rotation: new Quaternion().setEuler(0,0,90),
            scale: new Vector3().setAll(.5)
        }))
    }
    hide(){ if(this.alive) engine.removeEntity(this)}
    show(){ if(!this.alive) engine.addEntity(this)}
    setWalkable(isWalkable: boolean){
        if(this.isWalkable !== isWalkable){
            this.addComponentOrReplace(isWalkable ? Dash_Material.Blue(): Dash_Material.Black())
            this.isWalkable = isWalkable
        }
    }
    setIsOccupied(isOccupied: boolean){
        if(isOccupied){
            this.isOccupiedVisual.setParent(this)
            if(!this.isOccupiedVisual.alive){ engine.addEntity(this.isOccupiedVisual) }
        }else{
            this.isOccupiedVisual.setParent(null)
            if(this.isOccupiedVisual.alive){ engine.removeEntity(this.isOccupiedVisual) }
        }
    }
    setIsStartPoint(){
        this.addComponentOrReplace(IsStartPointMaterial)
    }
    setIsEndPoint(){
        this.addComponentOrReplace(IsEndPointMaterial)
    }
    setIsPath(){
        this.addComponentOrReplace(IsPathMaterial)
    }
}