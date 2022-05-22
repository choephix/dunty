import { GameSingletons } from "@game/app/GameSingletons";
import { TextInput } from "@game/asorted/TextInput";
import { EnchantedContainer } from "@game/core/enchanted-classes";
import { StationEntity } from "@game/data/entities/StationEntity";
import { GlowFilterService } from "@game/ui/fx/GlowFilterService";
import { GreenButton } from "@game/ui/railroader-dash/panels/settings/components/GreenButton";
import { Container, DisplayObject } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import prettyMilliseconds from "pretty-ms";
import { BillboardSprite } from "./components/BillboardSprite";
import { parseOutIPFSHash } from "./utils/parseOutIPFSHash";

export class BillboardDashboardPage extends EnchantedContainer {
  private readonly context = GameSingletons.getGameContext();

  textInput: TextInput;

  previewBtn: Sprite;
  trashBtn: Sprite;
  confirmBtn: Sprite;

  billboard: BillboardSprite;

  currentHash: string | null = null;

  clearContainer: Container = new Container();
  confirmClearContainer: Container = new Container();

  constructor(private readonly station: StationEntity) {
    super();

    const x = 50;
    const y = 400;
    const scale = 0.51;

    const bottomBarVerticleCenter = 418;

    this.addRecommendedDimensionsHint();

    // station.waxAssetData.billboard = "QmVGapRgP9n5WeAXc1GRAVg8GyDK3zSHfodHb4XSGcJmmV";
    const initialIPFSHash = this.station.billboardIPFSHash || null;

    this.billboard = new BillboardSprite();
    this.billboard.position.set(258, 368);
    this.billboard.scale.set(0.51);
    this.billboard.hide(true);
    this.addChild(this.billboard);
    if (initialIPFSHash) {
      this.setCurrentBillboardHash(initialIPFSHash);
      this.setClearButtonRemainingTime();
    } else {
      this.setPreviewRemainingTime();
    }

    const textInputBackground = this.addBg(x, y, scale);
    textInputBackground.anchor.y = 0.5;
    textInputBackground.position.set(x, bottomBarVerticleCenter);
    buttonizeDisplayObject(textInputBackground, () => this.textInput.focus());
    this.addChild(textInputBackground);

    this.previewBtn = this.addPreviewBtn(textInputBackground.x + textInputBackground.width, y, scale);

    [this.trashBtn, this.confirmBtn] = this.addConfirmAndTrashBtn(
      textInputBackground.x + textInputBackground.width,
      y,
      scale
    );
    this.addChild(textInputBackground, this.previewBtn, this.trashBtn, this.confirmBtn);

    const textInputPadding = 20;
    this.textInput = new TextInput({
      input: {
        fontSize: "14px",
        fontWeight: "bold",
        align: "center",
        color: "#ffffff",
        width: `${textInputBackground.width - textInputPadding * 2}px`,
      },
    });
    this.textInput.text = this.station.billboardIPFSHash || "";
    this.textInput.placeholder = "PASTE IPFS HASH";
    this.textInput.pivot.y = this.textInput.height / 2;
    this.textInput.position.set(textInputBackground.x + textInputPadding, bottomBarVerticleCenter);
    this.addChild(this.textInput);

    this.textInput.on("input", () => this.updateButtonsVisibility(true));
    this.previewBtn.visible = this.textInput.text != this.station.billboardIPFSHash;

    this.addPreviewEvent(this.previewBtn);
    this.addTrashEvent(this.trashBtn);
    this.addConfirmEvent(this.confirmBtn);

    this.updateButtonsVisibility(true);
  }

  get hasChanges() {
    return (this.textInput.text || null) != (this.station.billboardIPFSHash || null);
  }

  addRecommendedDimensionsHint() {
    const { simpleFactory } = this.context;
    const hintContainer = new Container();
    function addLine(line: string, fontSize: number) {
      const hintLabel = simpleFactory.createText(line.toUpperCase(), {
        fontSize: fontSize,
        lineHeight: fontSize + 5,
        align: "center",
        stroke: 0x0,
        strokeThickness: 1,
        dropShadow: true,
        dropShadowAngle: 1.57079632679,
        dropShadowColor: 0x010101,
        dropShadowDistance: 2,
        dropShadowAlpha: 0.6,
      });
      hintLabel.name = "dimensionsHint";
      hintLabel.anchor.set(0.5, 0.0);
      hintLabel.position.set(0, hintContainer.height);
      hintContainer.addChild(hintLabel);
    }

    addLine("Recommended\nImage Size", 16);
    addLine("661 x 364", 32);

    hintContainer.position.set(266, 170);
    this.addChild(hintContainer);
  }

  setTextInputEnabled(enabled: boolean) {
    this.textInput.disabled = !enabled;
    this.textInput.inputDom.style.visibility = enabled ? "visible" : "hidden";
    this.textInput.visible = !!this.textInput.text || enabled;
  }

  setCurrentBillboardHash(hash: string | null) {
    this.currentHash = hash;
    if (hash) {
      this.billboard.hide(true);
      this.billboard.setCurrentIPFSHash(hash);
      this.billboard.show();
    } else {
      this.billboard.hide();
    }
  }

  async setPreviewRemainingTime() {
    const time = await this.getTimeoutTimeLeft();
    this.confirmBtn.alpha = 1;
    this.confirmBtn.buttonMode = true;
    this.confirmBtn.interactive = true;
    if (time > 0) {
      const text = this.context.simpleFactory.createText(
        prettyMilliseconds(time * 1000, { unitCount: 3 }) + " REMAIN UNTIL NEXT CHANGE",
        { fontSize: 18 },
        { x: 175, y: 335 }
      );
      this.addChild(text);
      this.confirmBtn.alpha = 0.5;
      this.confirmBtn.buttonMode = false;
      this.confirmBtn.interactive = false;
    }
  }

  async setClearButtonRemainingTime() {
    //// Add clear button
    const clearBtn = this.context.simpleFactory.createSprite("station-billboard/clear-btn.png", { x: 556.43, y: 400 });
    clearBtn.scale.set(0.51);
    buttonizeDisplayObject(clearBtn, () => {
      this.clearContainer.visible = false;
      this.setConfirmClearRemainingTime();
    });
    this.clearContainer.addChild(clearBtn);

    //// Add remaining time
    const time = await this.getTimeoutTimeLeft();
    if (time > 0) {
      const staticText = this.context.simpleFactory.createText("TIME UNTIL CHANGEABLE", { fontSize: 18 });
      staticText.position.set(75, 407);
      this.clearContainer.addChild(staticText);
      console.log(time);
      const text = this.context.simpleFactory.createText(
        prettyMilliseconds(time * 1000, { unitCount: 3 }),
        { fontSize: 18 },
        { x: 410, y: 407 }
      );
      this.clearContainer.addChild(text);
    }

    this.addChild(this.clearContainer);

    //// Hide text input
    this.textInput.visible = false;
  }

  async setConfirmClearRemainingTime() {
    this.textInput.visible = false;
    const time = await this.getTimeoutTimeLeft();
    const staticText = this.context.simpleFactory.createText("CONFIRM CLEAR?", { fontSize: 14 });
    staticText.position.set(75, 410);
    this.confirmClearContainer.addChild(staticText);
    if (time > 0) {
      const text = this.context.simpleFactory.createText(
        prettyMilliseconds(time * 1000, { unitCount: 3 }) + " REMAIN UNTIL NEXT CHANGE",
        { fontSize: 14 },
        { x: 250, y: 410 }
      );
      this.confirmClearContainer.addChild(text);
    }

    const confirmBtn = new GreenButton(
      "CONFIRM",
      async () => {
        await this.performBillboardHashChangeAction(null);
        this.confirmClearContainer.removeChildren();
        this.setCurrentBillboardHash(null);
      },
      200
    );
    confirmBtn.scale.set(0.45);
    confirmBtn.position.set(555, 398);
    new GlowFilterService().addFilter(confirmBtn);
    this.confirmClearContainer.addChild(confirmBtn);
    this.addChild(this.confirmClearContainer);
  }

  //add input field background
  addBg(x: number, y: number, scale: number) {
    const inputBg = new Sprite(this.context.assets.getTexture("station-billboard/billboard-text-bar.png"));
    inputBg.position.set(x, y);
    inputBg.scale.set(scale);
    return inputBg;
  }

  addPreviewBtn(x: number, y: number, scale: number) {
    const previewBtn = new Sprite(this.context.assets.getTexture("station-billboard/preview-btn.png"));
    previewBtn.position.set(x, y);
    previewBtn.scale.set(scale);
    return previewBtn;
  }
  //set input field text
  setText(info: string | null) {
    if (info == undefined) return;
    this.textInput.text = info;

    if (this.textInput.width > (this.children[0] as Sprite).width / 2) {
      const ratio = (this.children[0] as Sprite).width / this.textInput.width;
      this.textInput.scale.set(ratio / 2);
    } else {
      this.textInput.scale.set(1);
    }
  }

  //switch between the preview button and the confirm/trash buttons
  updateButtonsVisibility(isPreview: boolean) {
    this.previewBtn.visible = isPreview && this.hasChanges;
    this.confirmBtn.visible = !isPreview;
    this.trashBtn.visible = !isPreview;
  }

  addPreviewEvent(sprite: Sprite) {
    buttonizeDisplayObject(sprite, () => {
      const currentInput = this.textInput.text.trim();
      const ipfsHash = parseOutIPFSHash(currentInput);

      this.textInput.text = ipfsHash;
      this.setTextInputEnabled(false);

      this.setCurrentBillboardHash(ipfsHash || null);

      this.updateButtonsVisibility(false);
    });
  }

  addTrashEvent(sprite: Sprite) {
    buttonizeDisplayObject(sprite, () => {
      const prevHash = this.station.billboardIPFSHash;

      this.setCurrentBillboardHash(prevHash);

      this.textInput.text = prevHash || "";
      this.setTextInputEnabled(true);

      this.updateButtonsVisibility(true);
    });
  }

  addConfirmEvent(sprite: DisplayObject) {
    buttonizeDisplayObject(sprite, async () => {
      const currentInput = this.textInput.text;
      const ipfsHash = parseOutIPFSHash(currentInput);
      return await this.performBillboardHashChangeAction(ipfsHash);
    });
  }

  addConfirmAndTrashBtn(x: number, y: number, scale: number) {
    const trashBtn = new Sprite(this.context.assets.getTexture("station-billboard/trash-tbn.png"));
    trashBtn.visible = false;
    trashBtn.position.set(x, y);
    trashBtn.scale.set(scale);
    const confirmBtn = new Sprite(this.context.assets.getTexture("station-billboard/confirm-btn.png"));
    confirmBtn.visible = false;
    confirmBtn.position.set(trashBtn.x + trashBtn.width, y);
    confirmBtn.scale.set(scale);

    return [trashBtn, confirmBtn];
  }

  generateBox(w: number, h: number, sprite: Sprite) {
    var box = new Container();
    var mask = new Graphics();

    mask.beginFill(0);
    mask.drawRoundedRect(0, 0, w, h, 36);

    box.addChild(sprite);
    box.addChild(mask);
    sprite.mask = mask;

    return box;
  }

  ///// DATA

  async performBillboardHashChangeAction(ipfsHash: string | null) {
    console.warn(`Setting billboard to ${ipfsHash}`);

    this.previewBtn.visible = false;
    this.confirmBtn.visible = false;
    this.trashBtn.visible = false;

    /**
     * This is a redundant check on mainnet, however when working on testnet
     * we often allow opening the dashboard for other stations as well.
     *
     * This check allows us to keep doing that, without breaking the flow
     * with a "station not owned" error.
     */
    if (this.station.ownerName === this.context.userData.name) {
      const stationId = this.station.assetId;

      const promise = this.context.contracts.myStation.setStationBillboardIpfsHash(stationId, ipfsHash);
      await this.context.spinner.showDuring(promise, "Updating Station Billboard");
    }

    this.station.waxAssetData.billboard = ipfsHash || "";
  }

  async getTimeoutTimeLeft() {
    const { contracts, gameConfigData } = this.context;
    const billboardLastChangedTime = await contracts.myStation.getStationBillboardChangeTime(this.station.assetId);
    const billboardChangeTimoutDuration = gameConfigData.billboardResetTime;
    const timeNowSeconds = Math.floor(new Date().getTime() / 1000.0);
    const timeLeft = billboardLastChangedTime + billboardChangeTimoutDuration - timeNowSeconds;
    return timeLeft;
  }
}
