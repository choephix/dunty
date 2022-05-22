import { GameContext } from "@game/app/app";
import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { WithFadingAnimation } from "@game/mixi/WithFadingAnimation";
import { Point } from "@pixi/math";
import { Text, TextStyle } from "@pixi/text";
import { buttonizeInstance } from "@sdk-ui/buttonize";
import { DropdownMenuButtonOptions } from "../popups/components/DropdownMenu";
import { RailroaderDashPanelType } from "../railroader-dash/panels/models";

const FadingText = WithFadingAnimation(Text);

export function createUserAccountIndicator() {
  const context = GameSingletons.getGameContext();
  const { app, events, sfx, contracts, modals, music, input } = context;

  const styles = {};
  const padding = new Point(20, 50);
  const screenAnchor = new Point(1.0, 0.0);

  const container = new EnchantedContainer();
  container.zIndex = 100;

  function createMenu() {
    const buttonsOptions: DropdownMenuButtonOptions[] = [
      {
        text: "Settings",
        disabled: false,
        onClick: () => {
          input.dispatch("openRailRoaderDashboard", RailroaderDashPanelType.Settings);
        },
      },
      {
        text: music.muted ? "Unmute Music" : "Mute Music",
        disabled: false,
        onClick: () => {
          if (music.muted) {
            music.unmute();
          } else {
            music.mute();
          }
          menu.destroy();
        },
      },
      {
        text: sfx.isMuted ? "Unmute SFX" : "Mute SFX",
        disabled: false,
        onClick: () => {
          if (sfx.isMuted) {
            sfx.unmute();
          } else {
            sfx.mute();
          }
          menu.destroy();
        },
      },
      {
        text: "Log Out",
        disabled: false,
        onClick: async () => input.dispatch("logOut"),
        style: styles,
      },
    ];

    const slightPivotingOffset = new Point(20, 20);
    const menu = context.main.hud.contextMenu.setCurrentMenu(buttonsOptions);
    menu.position.set(container.x - slightPivotingOffset.x, container.y + slightPivotingOffset.y + 40);
    menu.pivot.set(menu.containerWidth - slightPivotingOffset.x, slightPivotingOffset.y);

    return menu;
  }

  function addTextLine($text: string | (() => string), styleOverrides?: Partial<TextStyle>) {
    const tf = new FadingText(``, {
      fontFamily: FontFamily.Default,
      fontSize: 26,
      fontWeight: "bold",
      fill: 0xffffff,

      stroke: "#080808",
      strokeThickness: 1,

      // dropShadow: true,
      // dropShadowAngle: 1.57079632679,
      // dropShadowColor: 0x010101,
      // dropShadowDistance: 2,
      // dropShadowAlpha: 0.75,

      ...styleOverrides,
    });
    tf._alphaBase = tf.alpha = 0.4;
    container.addChild(tf);

    function updateText(text: string) {
      tf.text = text.trim().toUpperCase();
      tf.x = -screenAnchor.x * tf.width;
      tf.y = -screenAnchor.y * tf.height;
      updateIndicatorPositions(app.screen);
    }

    if (typeof $text === "function") {
      container.enchantments.watch($text, updateText, true);
    } else if (typeof $text === "string") {
      updateText($text.toUpperCase());
    }

    return tf;
  }

  const label_Username = addTextLine(() => (contracts.currentUserName || "") + "  ☰");

  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    container.position.set(
      (width - padding.x - padding.x) * screenAnchor.x + padding.x,
      (height - padding.y - padding.y) * screenAnchor.y + padding.y
    );
  }
  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  const buttonized = buttonizeInstance(container);

  buttonized.behavior.on({
    trigger: () => createMenu(),
  });

  return container;
}

export type UserAccountIndicator = ReturnType<typeof createUserAccountIndicator>;
