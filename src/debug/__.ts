import { GameContext } from "@game/app/app";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { range } from "@sdk/utils/range";
import { EventEmitter } from "eventemitter3";
import { __explore } from "./api/__explore";
import { makeDraggable } from "./utils/makeDraggable";

export const __var = {} as Record<string, any>;
export const __fn = {} as Record<string, Function>;
export const __ev = new EventEmitter();

function getGameContext() {
  return (<any>window).context as GameContext;
}

export const __add = {
  get ass() {
    return getGameContext().assets;
  },
  get stg() {
    return getGameContext().app.stage;
  },
  sprite(subject: string | Texture | Sprite, parent?: Container) {
    if (typeof subject === `string`) {
      subject = (this.ass.textures[subject] as Texture) ?? Texture.from(subject);
    }
    if (subject instanceof Texture) {
      subject = new Sprite(subject);
    }
    return (parent ?? this.stg).addChild(subject);
  },
  sprite2(
    subject: string | Texture | Sprite,
    parent: Container = getGameContext().app.stage,
    name: string = typeof subject === `string` ? subject : (<any>subject).name ?? `sprite`
  ) {
    if (typeof subject === `string`) {
      subject = (this.ass.textures[subject] as Texture) ?? Texture.from(subject);
    }

    if (subject instanceof Texture) {
      subject = new Sprite(subject);
    }

    if (subject instanceof Sprite) {
      subject.name = name;
    } else {
      throw new Error(`subject is not Sprite ` + subject);
    }

    const label = new Text(name, { fontSize: 12, fill: 0xffffff });
    label.position.set(2, 2);

    const labelPad = new Sprite(Texture.WHITE);
    labelPad.width = label.width + 4;
    labelPad.height = label.height + 4;
    labelPad.tint = 0x000000;
    labelPad.alpha = 0.5;

    const container = new Container();
    container.addChild(subject, labelPad, label);

    const g = new Graphics();
    g.lineStyle(1, 0xffff00, 0.25);
    g.drawRect(subject.x, subject.y, subject.width, subject.height);
    container.addChild(g);

    parent.addChild(container);
    makeDraggable(container);

    const btn = buttonizeInstance(labelPad);
    btn.behavior.on({
      trigger: () => {
        console.log(`// clicked //`, name);
        navigator.clipboard.writeText(name);
      },
      hoverIn: () => (label.style.fill = 0xffff00),
      hoverOut: () => (label.style.fill = 0xffffff),
    });

    return container;
  },
  sprites(
    subjects:
      | { textures: Record<string, string | Texture | Sprite> }
      | Record<string, string | Texture | Sprite>
      | string[]
      | Texture[]
      | Sprite[],
    parent: Container = getGameContext().app.stage
  ) {
    const hasTextures = (s: any): s is { textures: Record<string, string | Texture | Sprite> } =>
      "textures" in subjects;

    if (hasTextures(subjects)) {
      subjects = subjects.textures;
    }

    const sprites = [] as Sprite[];
    let y = 0;
    for (const [name, subject] of Object.entries(subjects)) {
      const sprite = this.sprite2(subject, parent, name) as Sprite;
      sprite.y = y += 20;
      sprites.push(sprite);
    }
    return sprites;
  },
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
export const __window__ = Object.assign(
  window as any as Record<string, any> & Window & Mutable<GameContext>,
  { __MIDDLE_MOUSE_BUTTON__: false },
  { __var, __ev, __fn, add: __add, __explore, makeDraggable, ["👁"]: new Array<any>() },
  { range, Texture, Sprite, Graphics, Text, Container }
);

// __window__.generateStations = () => {
//   function getDistance(a:any, b:any) {
//     const dx = a.x-b.x, dy = a.y-b.y;
//     return Math.sqrt(dx*dx + dy*dy);
//   }
//   const stations = getGameContext().mapData.stations as any[];
//   const ss = stations.map((s) => {
//     return {
//       station_id: s.uid,
//       rarity: [`common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`][s.rarityLevel - 1],
//       region: 'west',
//       multiplier: s.rarityLevel * 10 + 5 * ~~(Math.random() * 8),
//       type_rates: getRandomCommodityTypeRates(),
//       connected_stations: s.links.map(link => {
//         const otherStation = __window__.mapData.stations[link.assetId] as any;
//         const distance = getDistance(link.path.pointA, link.path.pointB);
//         return {
//           station_id: otherStation.uid,
//           distance: distance,
//         };
//       })
//     };
//   });
//   const longestDist = Math.max(...new Array<any>().concat(...ss.map((s) => s.connected_stations)).map(o => o.distance));
//   console.log({ longestDist });
//   new Array<any>().concat(...ss.map(s => s.connected_stations)).forEach(o => o.distance = Math.ceil(o.distance * 80 / longestDist))
//   return ss;
// };

// if (__DEBUG__) {
//   import(`pixi.js`).then(o => __window__.PIXI = o);
// }
