import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Rarity } from "@game/constants/Rarity";
import { getRarityColors } from "@game/constants/RarityColors";
import { EnchantedSprite } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";

export class CheckBox extends Sprite {
  public context = GameSingletons.getGameContext();
  private textureTicked: Texture;
  private textureUnticked: Texture;

  constructor() {
    super();
    const { assets } = this.context;
    this.textureTicked = assets.getTexture("ui-common/checked.png");
    this.textureUnticked = assets.getTexture("ui-common/unchecked.png");
    this.texture = this.textureUnticked;
  }
  setTicked(ticked: boolean) {
    this.texture = ticked ? this.textureTicked : this.textureUnticked;
  }
}

export class ToggleMenuEntry extends Container {
  public checkBox = new CheckBox();
  public ticked: boolean = false;

  constructor(text: string, ticked: boolean, onToggle: () => unknown) {
    super();

    let stationToggleText = new Text(text, { fill: 0xffffff, fontSize: 15, fontFamily: FontFamily.Default });
    this.ticked = ticked;

    buttonizeDisplayObject(stationToggleText, onToggle);

    this.checkBox.setTicked(this.ticked);
    this.checkBox.position.set(-15, 10);
    this.checkBox.anchor.set(0.5);

    this.addChild(stationToggleText);
    stationToggleText.addChild(this.checkBox);
  }
}

export function createMapToggleMenu() {
  const { app, assets, events } = GameSingletons.getGameContext();

  let toggleMenuOpen = false;
  let toggleMenuButton: ToggleMenuEntry;
  let bubblesToggle = createBubblesLayerService();
  let menuLine: Graphics;

  let menuButtonToggled = false;

  const visibleTexture = assets.getTexture("ui-common/eye.png");
  const padding = new Point(25, 140);
  const screenAnchor = new Point(1.0, 0.0);
  const button = new EnchantedSprite(visibleTexture);

  events.on({ resize: updateIndicatorPositions });
  updateIndicatorPositions(app.screen);

  button.zIndex = 100;
  button.alpha = 0.4;
  button.scale.set(0.25);
  button.anchor.copyFrom(screenAnchor);
  buttonizeDisplayObject(button, () => {
    if (toggleMenuOpen == false) {
      toggleMenuButton = createMapToggleMenuButton("Staking Hubs", menuButtonToggled, setStationAddonBubblesVisibility);

      menuLine = createMenuLine();

      toggleMenuButton.position.set(button.x - 80, button.y + 45);
      menuLine.position.set(button.x - 48, button.y + 30);

      app.stage.addChild(toggleMenuButton, menuLine);
      toggleMenuOpen = true;
    } else {
      destroyMapToggleMenu();
      toggleMenuOpen = false;
    }
  });

  function createMapToggleMenuButton(text: string, ticked: boolean, onToggle: () => unknown) {
    let stationToggleText = new ToggleMenuEntry(text, ticked, onToggle);
    button.alpha = 0.8;

    return stationToggleText;
  }

  function createMenuLine() {
    let menuLine = new Graphics();
    menuLine.clear();
    menuLine.beginFill(0xffffff);
    menuLine.drawRect(0, 0, 60, 3);
    menuLine.endFill();

    return menuLine;
  }

  function destroyMapToggleMenu() {
    if (toggleMenuButton != undefined) {
      button.alpha = 0.4;
      toggleMenuButton.destroy();
      menuLine.destroy();
      toggleMenuOpen = false;
    }
  }

  function setStationAddonBubblesVisibility() {
    if (!menuButtonToggled) {
      menuButtonToggled = true;
      toggleMenuButton.checkBox.setTicked(menuButtonToggled);
      bubblesToggle.show();
    } else {
      menuButtonToggled = false;
      toggleMenuButton.checkBox.setTicked(menuButtonToggled);
      bubblesToggle.hide();
    }
  }

  function updateIndicatorPositions({ width, height }: { width: number; height: number }) {
    button.position.set(
      padding.x + (width - padding.x - padding.x) * screenAnchor.x,
      padding.y + (height - padding.y - padding.y) * screenAnchor.y
    );
  }
  return button;
}

function createBubblesLayerService() {
  const { assets, mapData } = GameSingletons.getGameContext();

  let stations = mapData.stationsArray;
  let bubblesLayer = createBubbles(stations);
  bubblesLayer.visible = false;

  function createBubbles(stations: StationEntity[]) {
    let bubblesContainer = new Container();

    for (let station of stations) {
      if (station.addonTier_ConductorLounge != null && station.addonTier_ConductorLounge! > 0) {
        const loungeBubble = new Sprite(assets.getTexture("ui-common/stake-bubble-r-white.png"));
        const loungeIcon = new Sprite(assets.getTexture("ui-common/lounge.png"));
        let rarity = Rarity.fromNumberFromOne(station.addonTier_ConductorLounge);
        let color = getRarityColors(rarity).main;
        loungeBubble.tint = color.toInt();
        loungeIcon.scale.set(0.45);
        loungeIcon.anchor.set(0.5, 0.5);
        loungeBubble.pivot.set(0, loungeBubble.texture.height);
        loungeIcon.position.set(loungeBubble.width * 0.5, loungeBubble.height * 0.4);
        loungeBubble.scale.set(6);
        loungeBubble.position.set(station.extraData.x + 85, station.extraData.y - 150);
        loungeBubble.addChild(loungeIcon);
        bubblesContainer.addChild(loungeBubble);
      }
      if (station.addonTier_RailYard != null && station.addonTier_RailYard! > 0) {
        const railyardBubble = new Sprite(assets.getTexture("ui-common/stake-bubble-l-white.png"));
        const ryIcon = new Sprite(assets.getTexture("ui-common/railyard.png"));
        let rarity = Rarity.fromNumberFromOne(station.addonTier_RailYard);
        let color = getRarityColors(rarity).main;
        railyardBubble.tint = color.toInt();
        ryIcon.scale.set(0.45);
        ryIcon.anchor.set(0.5, 0.5);
        railyardBubble.pivot.set(railyardBubble.texture.width, railyardBubble.texture.height);
        ryIcon.position.set(railyardBubble.width * 0.5, railyardBubble.height * 0.4);
        railyardBubble.scale.set(6);
        railyardBubble.position.set(station.extraData.x - 75, station.extraData.y - 150);
        railyardBubble.addChild(ryIcon);
        bubblesContainer.addChild(railyardBubble);
      }
    }
    return bubblesContainer;
  }

  return {
    show() {
      this.refresh();
      bubblesLayer.visible = true;
    },
    hide() {
      bubblesLayer.destroy();
    },
    refresh() {
      const { world } = GameSingletons.getGameContext();
      bubblesLayer = createBubbles(stations);
      world.zoomLayers.operationsLayer.addChild(bubblesLayer);
    },
  };
}

export type MapToggle = ReturnType<typeof createMapToggleMenu>;
