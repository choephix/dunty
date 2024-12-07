import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
export declare const TILE_SIZE = 128;
export declare class Tile extends Container {
    readonly textureURL: string;
    readonly base: TileBase;
    isDungeonTile: boolean;
    textureFileName?: string;
    constructor(textureURL: string);
}
export declare class TileBase extends Container {
    readonly outline: Sprite;
    readonly inner: Sprite;
    constructor(textureURL: string);
}
export declare class TileHolo extends Container {
    constructor();
}
