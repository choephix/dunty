interface TileNaturalData {
    gridPositionX: number;
    gridPositionY: number;
    textureUrl: string;
    textureFileName: string;
    isDungeonTile: boolean;
}
export declare function getWorldGridNaturalData(): TileNaturalData[];
export {};
