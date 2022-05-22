import { GameSingletons } from "@game/app/GameSingletons";
import { getRarityColors } from "@game/constants/RarityColors";

export module AvatarBadgeElements {
  export const Colors = [
    [0x6f4f32, 0x1d7a45, 0x032871, 0x2c0f54, 0xe8b608, 0x6e1919, 0xf37121, 0xcb079f, 0x034053, 0x313131],
    [0x6f5f51, 0x45765a, 0x384869, 0x44286b, 0xf1d265, 0xc34d4d, 0xfda36b, 0xcb65b4, 0x1dd4e4, 0xffffff],
  ];

  export const Frames = ["gear-1", "gear-2", "gear-3"];

  export const Foregrounds = [
    "conductor/orson",
    "conductor/piggy-back-ned",
    "conductor/tommy",
    "conductor/shayan",
    "conductor/ash",
    "conductor/billy",
    "conductor/speedy-jame",
    "conductor/paloma",
    "conductor/missy",
    "conductor/tobias",
    "conductor/big-break-osipov",
    "conductor/johnny",
    "conductor/wesley",
    "conductor/gutshot-guthier",
    "conductor/kc",
    "passenger/lulu",
    "passenger/frankie",
    "passenger/shakia",
    "passenger/raul",
    "passenger/beth",
    "passenger/connor",
    "passenger/dansby",
    "passenger/aparna",
    "passenger/jasper",
    "passenger/shadow",
    "passenger/demarcus",
    "passenger/pnlop",
    "passenger/andrea",
    "passenger/marisol",
    "passenger/felix",
  ];
  export const Foregrounds_Conductors = Foregrounds.filter(o => o.startsWith("conductor"));
  export const Foregrounds_Passengers = Foregrounds.filter(o => o.startsWith("passenger"));

  export const Backgrounds = [
    "images/jgre",
    "images/lounge",
    "images/ry",
    "images/shop",
    "patterns/blobs",
    "patterns/canvas",
    "patterns/fancy",
    "patterns/industrial-1",
    "patterns/industrial-2",
    "patterns/inner-shadow",
    "patterns/solid",
    "patterns/wood",
    "stations/common",
    "stations/uncommon",
    "stations/rare",
    "stations/epic",
    "stations/legendary",
    "stations/mythic",
  ];
  export const Backgrounds_Patterns = Backgrounds.filter(o => o.startsWith("patterns"));
  export const Backgrounds_Images = Backgrounds.filter(o => o.startsWith("images"));
  export const Backgrounds_Stations = Backgrounds.filter(o => o.startsWith("stations"));

  export const NameplateBases = ["base-1"];
  export const NameplateRims = ["rim-notch", "rim-rope", "rim-tracks"];

  //// Foreground Colors

  export function getForegroundRarity(id: string): string | undefined {
    const [category, name] = id.split("/");
    if (category === "conductor") {
      return {
        "orson": "common",
        "piggy-back-ned": "common",
        "tommy": "common",
        "shayan": "uncommon",
        "ash": "uncommon",
        "billy": "uncommon",
        "speedy-jame": "rare",
        "paloma": "rare",
        "missy": "rare",
        "tobias": "epic",
        "big-break-osipov": "epic",
        "johnny": "legendary",
        "wesley": "legendary",
        "gutshot-guthier": "mythic",
        "kc": "mythic",
      }[name];
    }

    if (category === "passenger") {
      return {
        lulu: "common",
        frankie: "common",
        shakia: "common",
        raul: "uncommon",
        beth: "uncommon",
        connor: "uncommon",
        dansby: "rare",
        aparna: "rare",
        jasper: "rare",
        shadow: "epic",
        demarcus: "epic",
        pnlop: "legendary",
        andrea: "legendary",
        marisol: "mythic",
        felix: "mythic",
      }[name];
    }

    return undefined;
  }

  export function getForegroundHolderColor(id: string): number {
    const DEFAULT = 0xffffff;
    const rarity = getForegroundRarity(id);
    return rarity ? getRarityColors(rarity).main.toInt() : DEFAULT;
  }

  //// Conditions

  const _map_assetToCardId: Record<string, number> = {
    //// Foregrounds (Conductors)
    "conductor/orson": 1001,
    "conductor/piggy-back-ned": 1002,
    "conductor/tommy": 1003,
    "conductor/shayan": 1004,
    "conductor/ash": 1005,
    "conductor/billy": 1006,
    "conductor/speedy-jame": 1007,
    "conductor/paloma": 1008,
    "conductor/missy": 1009,
    "conductor/tobias": 1010,
    "conductor/big-break-osipov": 1011,
    "conductor/johnny": 1012,
    "conductor/wesley": 1013,
    "conductor/gutshot-guthier": 1014,
    "conductor/kc": 1015,

    //// Foregrounds (Passengers)
    "passenger/lulu": 5001,
    "passenger/frankie": 5002,
    "passenger/shakia": 5003,
    "passenger/raul": 5004,
    "passenger/beth": 5005,
    "passenger/connor": 5006,
    "passenger/dansby": 5007,
    "passenger/aparna": 5008,
    "passenger/jasper": 5009,
    "passenger/shadow": 5010,
    "passenger/demarcus": 5011,
    "passenger/pnlop": 5012,
    "passenger/andrea": 5013,
    "passenger/marisol": 5014,
    "passenger/felix": 5015,
  };
  export function canUserUseForeground(id: string): boolean {
    const { userData } = GameSingletons.getDataHolders();
    const cardId = _map_assetToCardId[id];
    if (!cardId) return true;
    for (const card of userData.iterateAllCards()) {
      console.log(`AvatarBadgeElements.canUserUseForeground()`, card.data.cardid, `===`, cardId);
      if (card.data.cardid === cardId) return true;
    }
    return false;
  }

  export function canUserUseBackground(id: string): boolean {
    const { mapData, userData } = GameSingletons.getDataHolders();
    const [category, name] = id.split("/");
    if (category == "patterns") {
      return true;
    }
    if (category == "images") {
      return true;
    }
    if (category == "stations") {
      const { userData } = GameSingletons.getDataHolders();
      const { faq } = GameSingletons.getMainInstance();
      for (const station of faq.iterateUserOwnedStations(userData.name)) {
        if (station.rarity.toLowerCase() === name.toLowerCase()) return true;
      }
      return false;
    }
    return true;
  }

  export function canUserUseFrame(id: string): boolean {
    return true;
  }

  export function canUserUseNameplateRim(id: string): boolean {
    return true;
  }

  export function canUserUseNameplateBase(id: string): boolean {
    return true;
  }

  export function getSortedData(data: Array<string>, testFunction: (item: string) => boolean) {
    const temp = [];
    for (let item of data) {
      temp.push({ texture: item, canUse: testFunction(item) });
    }
    return temp.sort((a, b) => Number(b.canUse) - Number(a.canUse));
  }

  //// Texture Ids

  const getTextureId = (path: string) => `https://train-of-the-century-media.web.app/social/${path}.png`;
  export const getFrameTextureId = (suffix: string) => getTextureId(`frames/` + suffix);
  export const getForegroundTextureId = (suffix: string) => getTextureId(`foreground/` + suffix);
  export const getBackgroundTextureId = (suffix: string) => getTextureId(`background/` + suffix);
  export const getNameplateTextureId = (suffix: string) => getTextureId(`nameplate/` + suffix);
  export const nameplateHolder = "https://train-of-the-century-media.web.app/social/nameplate/name-holder.png";
  export const braggingTitleImage =
    "https://train-of-the-century-media.web.app/social/nameplate/station-owner-plate.png";
}
