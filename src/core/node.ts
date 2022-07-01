import { IDash_Astar_Node, IDash_Astar_Node_Position } from "./interfaces";

export class Dash_Astar_Node {
    readonly position: IDash_Astar_Node_Position

    private fValue: number = 0
    private gValue: number = 0
    private hValue: number = 0
    
    private parentNode: Dash_Astar_Node | undefined
    private isOnClosedList: boolean = false
    private isOnOpenList: boolean = false
    private isWalkable: boolean

    constructor(settings: IDash_Astar_Node){
        this.position = settings.position
        this.isWalkable = settings.walkable || true
    }

    private calculateFValue(): void { this.fValue = this.gValue + this.hValue }
    public resetFGH(): void { this.fValue = this.gValue = this.hValue = 0 }

    public getFValue(): number { return this.fValue }
    public getGValue(): number { return this.gValue }
    public getHValue(): number { return this.hValue }
    public getParent(): Dash_Astar_Node | undefined { return this.parentNode }
    public getIsOnClosedList(): boolean { return this.isOnClosedList }
    public getIsOnOpenList(): boolean { return this.isOnOpenList }
    public getIsWalkable(): boolean { return this.isWalkable }

    public setGValue(gValue: number): void { this.gValue = gValue; this.calculateFValue() }
    public setHValue(hValue: number): void { this.hValue = hValue; this.calculateFValue() }
    public setParent(parent: Dash_Astar_Node | undefined): void { this.parentNode = parent }
    public setIsOnClosedList(isOnClosedList: boolean): void { this.isOnClosedList = isOnClosedList}
    public setIsOnOpenList(isOnOpenList: boolean): void { this.isOnOpenList = isOnOpenList}
    public setIsWalkable(isWalkable: boolean): void { this.isWalkable = isWalkable }

    public reset(){
        this.setIsOnClosedList(false)
        this.setIsOnOpenList(false)
        this.setParent(undefined)
        this.resetFGH()
    }
}