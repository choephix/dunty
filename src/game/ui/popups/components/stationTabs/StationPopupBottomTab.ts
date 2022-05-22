import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class StationPopupBottomTab extends Container {
  private readonly context = GameSingletons.getGameContext();

  public onClick?: () => unknown;

  private readonly expandedPad: Sprite;
  private readonly icon: Sprite;
  private readonly label: Sprite;

  constructor(cfg: { buttonTexture: string; iconTexture: string; labelText: string }) {
    super();

    //// Create expanded button sprite
    this.expandedPad = new Sprite(this.context.assets.getTexture(cfg.buttonTexture));

    //// Create button icon sprite
    this.icon = new Sprite(this.context.assets.getTexture(cfg.iconTexture));
    this.icon.position.set(75, 55);
    this.icon.scale.set(0.6);

    //// Create label text
    this.label = new Text(cfg.labelText, {
      fontFamily: FontFamily.Default,
      fontSize: 24,
      lineHeight: 24,
      fill: 0xffffff,
    });
    this.label.anchor.x = 0.5;
    this.label.position.set(this.icon.x + this.icon.width / 2, 20);

    this.addChild(this.expandedPad, this.icon, this.label);

    //// Add click event for tab expansion
    this.renderable = false;
    buttonizeDisplayObject(this, () => this.onClick?.());
  }

  setTint(background: number, foreground: number) {
    this.expandedPad.tint = background;
    this.icon.tint = foreground;
    this.label.tint = foreground;
  }

  setEnabled(active: boolean) {
    this.interactive = active;
    this.buttonMode = active;
    if (!active) {
      this.alpha = 0.75;
    }
  }

  setSelected(value: boolean) {
    //TO DO: when collapsed sprites are added switch between them and expanded ones
    this.renderable = value;
  }
}
