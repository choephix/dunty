import { SolidDimmer } from "@game/ui/common/SolidDimmer";
import { DropdownMenu, DropdownMenuButtonOptions } from "@game/ui/popups/components/DropdownMenu";
import type { DropdownStyleOptions } from "@game/ui/popups/components/DropdownMenuButton";
import { Container } from "@pixi/display";
import type { InteractionManager } from "@pixi/interaction";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";

type PartialStyle = Partial<DropdownStyleOptions>;

export class ContextMenuManager {
  public readonly modalBlocker: SolidDimmer;
  public currentMenu: DropdownMenu | null = null;

  public defaultMenuStyle: DropdownStyleOptions = {
    leftPadding: 40,
    rightPadding: 40,
    boxWidth: 100,
    boxHeight: 40,
    buttonFontSize: 20,
    buttonBGColor: 0x101010,
    buttonHoverColor: 0x191919,
    buttonFontColor: 0xffffff,
    buttonDiabledColor: 0x101010,
    buttonFontHover: 0x00ffff,
  };

  constructor(public readonly container: Container, private readonly interactionManager?: InteractionManager) {
    this.modalBlocker = new SolidDimmer();
    this.modalBlocker.interactive = true;
    this.modalBlocker.show();
    this.modalBlocker.on("pointerdown", () => this.setCurrentMenuInstance(null));

    this.modalBlocker.renderable = false;
  }

  private setCurrentMenuInstance(menu: DropdownMenu | null) {
    if (this.currentMenu === menu) {
      return;
    }

    const prevMenu = this.currentMenu;
    if (prevMenu) {
      this.playHideAnimationOn(prevMenu).then(() => prevMenu.destroy());
    }

    this.currentMenu = menu;

    if (this.currentMenu) {
      this.currentMenu.events.on({ onItemClick: () => this.setCurrentMenuInstance(null) });

      this.container.addChild(this.modalBlocker);
      this.container.addChild(this.currentMenu);

      this.playShowAnimationOn(this.currentMenu);
    } else {
      this.container.removeChild(this.modalBlocker);
    }
  }

  private createMenuInstance(buttonOptions: DropdownMenuButtonOptions[], style?: PartialStyle) {
    console.log("createMenuInstance", style);
    console.log("createMenuInstance1", { ...this.defaultMenuStyle, ...style });

    const menu = new DropdownMenu(buttonOptions, { ...this.defaultMenuStyle, ...style });
    return menu;
  }

  setCurrentMenu(menu: null): null;
  setCurrentMenu(menu: DropdownMenuButtonOptions[], style?: PartialStyle): DropdownMenu;
  setCurrentMenu(buttonOptions: DropdownMenuButtonOptions[] | null, style?: PartialStyle): DropdownMenu | null {
    console.log("setCurrentMenu", style);

    const menu = buttonOptions ? this.createMenuInstance(buttonOptions, style) : null;

    if (menu && this.interactionManager) {
      const globalMousePosition = this.interactionManager.mouse.global;
      menu.position.copyFrom(globalMousePosition);

      const anchor = {
        x: globalMousePosition.x < menu.containerWidth + 50 ? 0 : 1,
        y: globalMousePosition.y / this.interactionManager.renderer.width,
      };
      menu.pivot.set(anchor.x * menu.containerWidth, anchor.y * menu.containerHeight);
    }

    this.setCurrentMenuInstance(menu);
    return menu;
  }

  playShowAnimationOn(menu: DropdownMenu) {
    const tweeener = new TemporaryTweeener(menu);
    return tweeener.from(menu, { pixi: { scale: 0, alpha: 0 }, duration: 0.65, ease: "elastic(0.35).out" });
  }

  playHideAnimationOn(menu: DropdownMenu) {
    const tweeener = new TemporaryTweeener(menu);
    return tweeener.to(menu, { pixi: { scale: 0.3, alpha: 0 }, duration: 0.24, ease: "back.in" });
  }
}
