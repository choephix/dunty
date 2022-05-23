import { GameSingletons } from "@client";
import { BLEND_MODES } from "@pixi/constants";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";

// const T_BACKDROP = `https://public.cx/dunty/bg-1080x1920/gb60.jpg`;
const T_BACKDROP = `https://public.cx/dunty/bg-1920x1920/4.jpg`;

const DESIGN_SPECS = {
  width: 1080,
  height: 1920,
};

export class VCombatStage extends Container {
  readonly designWidth = DESIGN_SPECS.width;
  readonly designHeight = DESIGN_SPECS.height;

  readonly backdrop;
  readonly ln;

  constructor() {
    super();

    this.backdrop = Sprite.from(T_BACKDROP);
    this.backdrop.anchor.set(0.5);
    this.backdrop.position.set(this.designWidth / 2, this.designHeight / 2);
    this.addChild(this.backdrop);

    const lnTextureId = "https://public.cx/mock/ln2.jpg";
    this.ln = TilingSprite.from(lnTextureId, { width: this.designWidth, height: this.designHeight });
    // this.ln.blendMode = BLEND_MODES.ADD;
    this.ln.blendMode = BLEND_MODES.SUBTRACT;
    this.ln.tint = 0xf03030;
    this.ln.scale.y = 2;
    this.ln.tileScale.y = 4;
    this.addChild(this.ln);

    this.ln.visible = false;

    const border = new Graphics();
    border.lineStyle(4, 0xffffff);
    border.drawRect(0, 0, this.designWidth, this.designHeight);
    border.alpha = 0.05;
    this.addChild(border);
  }

  onEnterFrame() {
    const app = GameSingletons.getPixiApplicaiton();
    const SCALE = Math.min(app.screen.width / this.designWidth, app.screen.height / this.designHeight);
    this.scale.set(SCALE);
    this.position.set(
      0.5 * (app.screen.width - this.designWidth * SCALE),
      0.5 * (app.screen.height - this.designHeight * SCALE)
    );

    this.ln.tilePosition.y -= 40;
  }

  // addChildAtFractionalPosition(child: Sprite, x: number, y: number) {
  //   child.position.copyFrom(this.getFractionalPosition(x, y));
  //   this.addChild(child);
  // }

  getFractionalPosition(x: number, y: number) {
    return { x: x * this.designWidth, y: y * this.designHeight };
  }
}
