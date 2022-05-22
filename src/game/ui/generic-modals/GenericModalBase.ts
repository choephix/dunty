import { __window__ } from "@debug/__";
import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Container, DisplayObject } from "@pixi/display";
import { NineSlicePlane } from "@pixi/mesh-extras";
import { Sprite } from "@pixi/sprite";
import { Text, TextStyle } from "@pixi/text";
import { BitmapText, IBitmapTextStyle } from "@pixi/text-bitmap";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { LiteralUnion, ReadonlyDeep } from "type-fest";
import { createMeshyButton } from "../components/createMeshyButton";

export enum GenericModalBaseCornerDetailType {
  Warning = "alert-corner",
  Tocium = "tocium-corner",
  Gears = "gears",
}

export enum GenericModalBaseTextureId {
  RailRunReport = "ui-general-modal/bg.png",
  Standard = "ui-general-modal/modal.png",
  Grey = "ui-general-modal/modal-white.png",
}

export type GenericModalBaseOptions = ReadonlyDeep<{
  background: {
    textureId: LiteralUnion<GenericModalBaseTextureId, string>;
    slicing: [leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number];
  };
  cornerDetailType?: GenericModalBaseCornerDetailType | null;
  title: string;
  content?: string | (() => Sprite | (DisplayObject & { width: number; height: number }));
  buttons?: {
    labelText: string;
    onClick: (this: GenericModalBase<any>) => void;
    color?: string;
  }[];
  breathingRoom?: number;
  width?: number;
}>;

export class GenericModalBase<T = void> extends NineSlicePlane {
  private readonly context: GameContext = GameSingletons.getGameContext();

  #width = 1;
  #height = 1;

  public buttonsEnabled = true;

  public emitResult?: (result: T) => void;

  constructor(public readonly options: GenericModalBaseOptions) {
    super(
      GameSingletons.getGameContext().assets.getTexture(options.background.textureId),
      ...options.background.slicing
    );

    this.width = this.options.width ?? this.texture.width;
    this.height = this.texture.height;

    this.interactive = true;
    this.buttonMode = true;

    //// Elements ////

    type DisplayObjectWithHeight = DisplayObject & { height: number };
    type ElementExtraProperties = { marginTop: number; marginBottom: number };
    type ElementRow = DisplayObjectWithHeight & ElementExtraProperties;
    const elementRows = new Array<ElementRow>();
    const addChildElementRow = <T extends DisplayObjectWithHeight>(
      target: T,
      properites: Partial<ElementExtraProperties> = {}
    ) => {
      const child = Object.assign(target, {
        marginTop: 0,
        marginBottom: 0,
        ...properites,
      });
      this.addChild(child);
      elementRows.push(child);
      return child;
    };

    const titleLabelText = options.title.trim();
    if (titleLabelText) {
      const titleLabelStyle = {
        fontName: "Celestial Typeface",
        align: "center",
      } as IBitmapTextStyle;
      const titleLabel = addChildElementRow(new BitmapText(options.title.trim(), titleLabelStyle), {
        marginTop: 0,
        marginBottom: 10,
      });
      this.addChild(titleLabel);
      titleLabel.updateText();
      titleLabel.anchor.set(0.5, 0.0);
    }

    if (options.content) {
      if (typeof options.content === "string") {
        const longTextStyle = {
          fontFamily: FontFamily.Default,
          fontSize: 32,
          lineHeight: 48,
          wordWrap: true,
          wordWrapWidth: this.width * 0.8,
          align: "center",
          fill: 0xffffff,
        } as TextStyle;
        const longText = addChildElementRow(new Text(options.content.trim(), longTextStyle), {
          marginTop: 0,
          marginBottom: 0,
        });
        longText.updateText(false);
        longText.anchor.set(0.5, 0.0);
      } else {
        const content = addChildElementRow(options.content());
      }
    }

    const buttonsConfiguration = options.buttons;
    if (buttonsConfiguration) {
      const createButtonsGrid = () => {
        const container = new Container();

        const buttons = buttonsConfiguration.map(({ labelText, onClick }, btnIndex) =>
          createMeshyButton(labelText.toUpperCase(), 300 + labelText.length * 13, () =>
            !this.buttonsEnabled ? Promise.resolve() : onClick.call(this)
          )
        );
        container.addChild(...buttons);

        //// ONE ROW
        let xx = 0;
        for (const button of buttons) {
          button.scale.set(0.8);
          button.x = xx + button.width / 2;
          button.y = button.height / 2;
          xx += button.width;
        }

        container.pivot.x = xx / 2;

        return container;
      };

      addChildElementRow(createButtonsGrid(), {
        marginTop: -0,
        marginBottom: 10,
      });
    }

    //// Layout ////

    const positionElements = () => {
      const paddingTop = options.background.slicing[1] || 0;
      const paddingBottom = options.background.slicing[3] || 0;
      const elementRowsHeightsSum = elementRows.reduce(
        (total, elementRow) => total + elementRow.marginTop + elementRow.marginBottom + elementRow.height,
        0
      );
      const availableHeight = this.#height - paddingTop - paddingBottom;
      let remainder = availableHeight - elementRowsHeightsSum;

      // console.log({
      //   elementRows,
      //   elementRowsHeights: elementRows.map(o => o.height),
      //   elementRowsHeightsSum,
      //   availableHeight,
      //   remainder,
      // });

      const minimumTotalRemainder = options.breathingRoom ?? 50;
      if (remainder < minimumTotalRemainder) {
        this.height = elementRowsHeightsSum + paddingTop + paddingBottom + minimumTotalRemainder;
        remainder = minimumTotalRemainder;
      }

      const spacing = remainder / elementRows.length;
      let y = paddingTop + spacing;
      for (const elementRow of elementRows) {
        const bounds = elementRow.getLocalBounds();
        elementRow.x = this.width / 2;
        elementRow.y = y - bounds.y + elementRow.marginTop;
        y += elementRow.height + elementRow.marginTop + elementRow.marginBottom + spacing;

        // markBounds(elementRow, 0x00ff00);
      }

      __window__.ell = elementRows;
    };

    positionElements();

    //// Corner Detail ////

    if (options.cornerDetailType) {
      this.addCornerDetail(options.cornerDetailType);
    }
  }

  async playShowAnimation() {
    this.buttonsEnabled = false;

    const targetWidth = this.width;

    const children = this.children as Array<DisplayObject & { show?: Function }>;
    const childrenWithoutShowMethod = children.filter(child => !child.show);
    const childrenWithShowMethod = children.filter(child => typeof child.show === "function");

    childrenWithoutShowMethod.forEach(target => {
      target.alpha = 0;
      target.scale.set(0.9);
    });
    childrenWithShowMethod.forEach(target => {
      target.visible = false;
    });

    // const tweeener = this.tweeener;
    const tweeener = this.context.animator.tween;

    await tweeener.fromTo(
      this,
      {
        pixi: {
          width: 100,
          pivotX: 50,
        },
      },
      {
        pixi: {
          width: targetWidth,
          pivotX: targetWidth / 2,
        },
        duration: 0.37,
        ease: "back.out",
        // onStart: () => {
        //   this.tint = 0x808080;
        // }
      }
    );
    await tweeener.to(childrenWithoutShowMethod, {
      pixi: {
        scale: 1,
        alpha: 1,
      },
      duration: 0.22,
      stagger: 0.12,
      ease: "power2.in",
      // onUpdate: () => {
      //   this.tint = ~~(Math.random() * 0xffffff);
      // },
      // onComplete: () => {
      //   this.tint = 0xffffff;
      // }
    });

    await Promise.all(
      childrenWithShowMethod.map(child => {
        child.visible = true;
        child.show?.();
      })
    );

    this.buttonsEnabled = true;
  }

  async playHideAnimation() {
    this.buttonsEnabled = false;

    const children = this.children as Array<DisplayObject & { hide?: Function }>;
    await Promise.all(children.map(child => child.hide?.()));

    children.forEach(target => (target.alpha = 0));

    // const tweeener = this.tweeener;
    const tweeener = this.context.animator.tween;

    await tweeener.to(this, {
      pixi: {
        width: 200,
        pivotX: 100,
        alpha: 0,
      },
      duration: 0.29,
      ease: "back.in",
    });
  }

  addCornerDetail(type: GenericModalBaseCornerDetailType) {
    const cornerDetail = new Sprite(this.context.assets.getTexture(`ui-general-modal/${type}.png`));
    this.addChildAt(cornerDetail, 0);
    cornerDetail.anchor.set(1.0);
    cornerDetail.position.set(this.width - 63, this.height - 59);
  }

  async hideAndDestroy() {
    await this.playHideAnimation?.();
    this.destroy({ children: true });
  }

  // #bounds = new Rectangle(0, 0, this.#width, this.#height);

  get width() {
    return this.#width;
  }

  set width(value: number) {
    super.width = this.#width = value;
    this.pivot.x = value / 2;
  }

  get height() {
    return this.#height;
  }

  set height(value: number) {
    super.height = this.#height = value;
    this.pivot.y = value / 2;
  }
}
