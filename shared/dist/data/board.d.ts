import { Space, GroupKey } from "../types";
export declare const GROUP_COLORS: Record<GroupKey, string>;
export declare const NAADU: Record<GroupKey, string>;
export declare const SPACES: Space[];
export declare const BOARD_SIZE: number;
/** grid placement for the 11x11 ring (row, col), 1-indexed for CSS grid */
export declare function gridPos(id: number): [number, number];
export declare function side(id: number): "corner" | "bottom" | "left" | "top" | "right";
