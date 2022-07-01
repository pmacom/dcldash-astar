/**
 * Resources:
 * http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
 * https://en.wikipedia.org/wiki/Taxicab_geometry
 * https://en.wikipedia.org/wiki/Euclidean_distance
 * https://en.wikipedia.org/wiki/Chebyshev_distance
 * http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter17_Pathfinding_Architecture_Optimizations.pdf
 * https://github.com/riscy/a_star_on_grids#heuristics
 */

import { Dash_Astar_Heuristic, IDash_Astar_Node_Position } from './interfaces';

 /**
  * Calculate for two positions the heuristic function.
  * @param heuristicFunction
  * @param pos0
  * @param pos1
  * @param weight
  */
 export function calculateHeuristic(
   heuristicFunction: Dash_Astar_Heuristic,
   pos0: IDash_Astar_Node_Position,
   pos1: IDash_Astar_Node_Position,
   weight: number
 ): number {
   const dx = Math.abs(pos1.x - pos0.x);
   const dy = Math.abs(pos1.y - pos0.y);
 
   switch (heuristicFunction) {
     // TODO: Remove Manhatten in next major release
     case Dash_Astar_Heuristic.Manhattan:
     case Dash_Astar_Heuristic.Manhatten:
       /**
        * Calculate the Manhattan distance.
        * Generally: Overestimates distances because diagonal movement not taken into accout.
        * Good for a 4-connected grid (diagonal movement not allowed)
        */
       return (dx + dy) * weight;
     case Dash_Astar_Heuristic.Euclidean:
       /**
        * Calculate the Euclidean distance.
        * Generally: Underestimates distances, assuming paths can have any angle.
        * Can be used f.e. when units can move at any angle.
        */
       return Math.sqrt(dx * dx + dy * dy) * weight;
     case Dash_Astar_Heuristic.Chebyshev:
       /**
        * Calculate the Chebyshev distance.
        * Should be used when diagonal movement is allowed.
        * D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
        * D = 1 and D2 = 1
        * => (dx + dy) - Math.min(dx, dy)
        * This is equivalent to Math.max(dx, dy)
        */
       return Math.max(dx, dy) * weight;
     case Dash_Astar_Heuristic.Octile:
       /**
        * Calculate the Octile distance.
        * Should be used on an 8-connected grid (diagonal movement allowed).
        * D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
        * D = 1 and D2 = sqrt(2)
        * => (dx + dy) - 0.58 * Math.min(dx, dy)
        */
       return (dx + dy - 0.58 * Math.min(dx, dy)) * weight;
   }
 }