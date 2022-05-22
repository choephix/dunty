import { SimpleObjectsFactory } from "@game/app/components/SimpleObjectsFactory";
import { GameSingletons } from "@game/app/GameSingletons";
import {
  animateObjectsInViaTimeline,
  animateObjectsOutViaTimeline,
} from "@game/asorted/animations/animateObjectsInViaTimeline";
import { modifyPivotWithoutChangingPosition } from "@game/asorted/centerPivotWithoutChangingPosition";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { EnchantmentGlobals } from "@sdk/pixi/enchant/EnchantmentGlobals";
import { SocialProfileDataService } from "../SocialProfileDataService";
import { AvatarBadgeNameplate } from "./components/AvatarBadgeNameplate";
import { AvatarBadgePreferences } from "@game/ui/social/avatar/AvatarBadgePreferences";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { RailroaderMedalArc } from "./components/RailroaderMedalArc";
import { AccountName } from "@sdk-integration/contracts";
import { getRarityColors } from "@game/constants/RarityColors";

const DESIGN_WIDTH = 960;
const DESIGN_HEIGHT = 1010;

export class AvatarBadge extends Container {
  public readonly tweeener = new TemporaryTweeener(this);

  private frameSpinSpeed = 1;
  private readonly loadingJobs = new Set<Promise<any>>();

  private readonly foregroundImage: Sprite;
  private readonly backgroundImage: Sprite;
  private readonly frameImage: Sprite;
  public readonly nameplate: AvatarBadgeNameplate;
  public readonly railroaderArc: RailroaderMedalArc;

  public get width(): number {
    return DESIGN_WIDTH * this.scale.x;
  }
  public get height(): number {
    return DESIGN_HEIGHT * this.scale.y;
  }

  constructor() {
    super();

    //// Create background
    this.backgroundImage = new Sprite(Texture.EMPTY);

    //// Create foreground
    this.foregroundImage = new Sprite(Texture.EMPTY);
    this.foregroundImage.position.y = 25;

    //// Create nameplate
    this.nameplate = new AvatarBadgeNameplate();
    this.nameplate.position.set(480, 840);

    //// Create frame
    this.frameImage = new Sprite(Texture.EMPTY);

    this.addChild(this.backgroundImage);
    this.addChild(this.foregroundImage);
    this.addChild(this.frameImage);
    this.addChild(this.nameplate);

    //// Medal Arc
    this.railroaderArc = new RailroaderMedalArc(145);
    this.railroaderArc.position.set(480, 530);
    this.railroaderArc.scale.set(2.95);
    this.addChild(this.railroaderArc);

    this.railroaderArc.visible = false;
  }

  onEnterFrame() {
    this.frameImage.angle -= this.frameSpinSpeed * EnchantmentGlobals.timeDelta;
  }

  //// Elements

  private async loadAndApplyNewTexture(target: Sprite, url: string) {
    /**
     * Turns out changing the tint can bug out if you also change the color during the loading.
     */
    // let noTint = 0xffffff;
    // if (target.tint) noTint = target.tint;
    // target.tint = 0x303030;
    // const texture = await Texture.fromURL(textureId);
    // target.texture = texture;
    // target.tint = noTint;

    /**
     * Start loading the texture right away.
     */
    const loaderPromise = Texture.fromURL(url).catch(() => Texture.EMPTY);

    /**
     * Add the loading job to the list, so that we can query if any part is currently busy being loaded.
     */
    this.loadingJobs.add(loaderPromise);

    /**
     * Fade out the current version of the part, while the new texture is being loaded.
     */
    target.alpha = 0.3;
    const texture = await loaderPromise;
    target.texture = texture;
    target.alpha = 1;

    /**
     * Remove the loading job from the list.
     */
    this.loadingJobs.delete(loaderPromise);

    modifyPivotWithoutChangingPosition(target, 0.5);
  }

  async setForegroundImage(textureId: string) {
    await this.loadAndApplyNewTexture(this.foregroundImage, textureId);
  }

  async setBackgroundImage(textureId: string) {
    await this.loadAndApplyNewTexture(this.backgroundImage, textureId);
  }

  async setFrameImage(textureId: string) {
    await this.loadAndApplyNewTexture(this.frameImage, textureId);
  }

  async setNameplateNameHolder(textureId: string) {
    const texture = await Texture.fromURL(textureId);
    this.nameplate.core.texture = texture;
  }

  async setNameplateImage(textureId: string) {
    await this.loadAndApplyNewTexture(this.nameplate.base, textureId);
  }

  async setNameplateFrameImage(textureId: string) {
    await this.loadAndApplyNewTexture(this.nameplate.frame, textureId);
  }

  setBackgroundTint(color: number) {
    this.backgroundImage.tint = color;
  }

  setFrameTint(color: number) {
    this.frameImage.tint = color;
  }

  setNameplateFrameTint(color: number) {
    this.nameplate.frame.tint = color;
  }

  setNameplateTint(color: number) {
    this.nameplate.base.tint = color;
  }

  async setBraggingTitle(text: string, color: number) {
    if (text) {
      const textureId = AvatarBadgeElements.braggingTitleImage;
      const texture = await Texture.fromURL(textureId);
      const element = this.nameplate.greateBraggingTitle();
      element.pad.texture = texture;
      element.pad.tint = color;
      element.label.text = text.toUpperCase();
      element.visible = true;
    } else {
      if (this.nameplate.braggingTitle) {
        this.nameplate.braggingTitle.destroy();
        this.nameplate.braggingTitle = undefined;
      }
    }
  }

  async setUsername(text: string, color: number = 0xffffff) {
    this.nameplate.label.text = text.toUpperCase();
    this.nameplate.label.style.fill = color;
    fitObjectInRectangle(this.nameplate.label, {
      x: -266,
      y: -49,
      width: 532,
      height: 98,
    });
  }

  showMedalArc(show: boolean) {
    this.railroaderArc.visible = show;
  }

  getCurrentConfiguration() {
    const conf = {
      foregroundImage: this.foregroundImage,
      backgroundImage: this.backgroundImage,
      frameImage: this.frameImage,
      nameplateFrame: this.nameplate.frame,
    };
    return conf;
  }

  waitUntilAllPartsLoaded() {
    return Promise.all(this.loadingJobs);
  }

  playShowAnimation(delay: number = 0) {
    if (this.nameplate.braggingTitle) {
      this.nameplate.braggingTitle.visible = false;
    }
    return animateObjectsInViaTimeline(
      [
        [this, { frameSpinSpeed: 999, duration: 1.0, ease: "power3.out" }, 0],
        [this.frameImage, { pixi: { scale: 0, alpha: 0.7 }, duration: 0.5, ease: "back.out" }],
        [this.backgroundImage, { pixi: { scale: 1.2, alpha: 0.0 }, duration: 0.3, ease: "power2.out" }, 0.22],
        [this.foregroundImage, { pixi: { scale: 0.3, pivotY: -50 }, duration: 0.3, ease: "power2.out" }, 0.11],
        [this.foregroundImage, { pixi: { alpha: 0.0 }, duration: 0.3, ease: "power4.out" }],
        [this.nameplate, { pixi: { alpha: 0.0 }, duration: 0.5, ease: "power2.out" }, 0.22],
        [this.nameplate, { pixi: { scale: 1.3 }, duration: 0.5, ease: "bounce.out" }, 0.0],
        [this.nameplate.label, { pixi: { alpha: 0.0 }, duration: 0.5, ease: "power.out" }, 0.17],
        [this.nameplate.braggingTitle?.playShowAnimation, this.nameplate.braggingTitle, 0.33],
      ],
      this.tweeener,
      delay
    );
  }

  playHideAnimation() {
    return animateObjectsOutViaTimeline(
      [
        [this, { frameSpinSpeed: -999, duration: 0.2, ease: "back.in" }, 0],
        [this.nameplate, { pixi: { scale: 0 }, duration: 0.2, ease: "back.in" }, 0.0],
        [this.frameImage, { pixi: { scale: 0, alpha: 0.7 }, duration: 0.26, ease: "back.in" }, 0.08],
        [this.foregroundImage, { pixi: { scale: 0.0, alpha: 0.0 }, duration: 0.22, ease: "power2.in" }, 0.11],
        [this.backgroundImage, { pixi: { scale: 0.0, alpha: 0.0 }, duration: 0.22, ease: "power2.in" }],
      ],
      this.tweeener
    );
  }
}

export module AvatarBadge {
  export function create(username: string, preferences: AvatarBadgePreferences, showMedals: boolean) {
    const avatar = new AvatarBadge();
    applyUserData(avatar, username, preferences);
    if (showMedals) avatar.showMedalArc(true);
    return avatar;
  }

  export async function applyMyUserData(avatar: AvatarBadge, preferences?: AvatarBadgePreferences) {
    if (!preferences) {
      const dataService = new SocialProfileDataService();
      preferences = await dataService.getMyAvatarBadgePreferences();
    }

    const { userData } = GameSingletons.getGameContext();
    return applyUserData(avatar, userData.name, preferences);
  }

  export async function applyUserData(avatar: AvatarBadge, username: string, preferences?: AvatarBadgePreferences) {
    if (!preferences) {
      const dataService = new SocialProfileDataService();
      preferences = await dataService.getAvatarBadgePreferences(username);
    }

    if (avatar.destroyed) return;

    applyPreferences(avatar, preferences);

    const { main } = GameSingletons.getGameContext();
    const userOwnedStations = [...main.faq.iterateUserOwnedStations(username as AccountName)].sort((a, b) => b.rarityLevel - a.rarityLevel);
    const userRarestStation = userOwnedStations.length > 0 ? userOwnedStations[0] : undefined;
    if (userRarestStation) {
      const rarityColor = getRarityColors(userRarestStation.rarity).main.toInt();
      avatar.setBraggingTitle("Station Owner", rarityColor);
    }

    avatar.setUsername(username);

    return avatar;
  }

  export function applyPreferences(avatar: AvatarBadge, preferences: AvatarBadgePreferences) {
    avatar.setForegroundImage(AvatarBadgeElements.getForegroundTextureId(preferences.foregroundImage));
    avatar.setBackgroundImage(AvatarBadgeElements.getBackgroundTextureId(preferences.backgroundImage));
    avatar.setBackgroundTint(preferences.backgroundColor);
    avatar.setFrameImage(AvatarBadgeElements.getFrameTextureId(preferences.frameImage));
    avatar.setFrameTint(preferences.frameColor);

    avatar.setNameplateNameHolder(AvatarBadgeElements.nameplateHolder);
    avatar.setNameplateImage(AvatarBadgeElements.getNameplateTextureId(preferences.nameplateBaseImage));
    avatar.setNameplateTint(preferences.nameplateBaseColor);
    avatar.setNameplateFrameImage(AvatarBadgeElements.getNameplateTextureId(preferences.nameplateRimImage));
    avatar.setNameplateFrameTint(preferences.nameplateRimColor);

    return avatar;
  }

  export async function showWhenFullyLoaded(avatar: AvatarBadge, animate: boolean = true) {
    avatar.visible = false;
    await avatar.waitUntilAllPartsLoaded();
    if (avatar.destroyed) return;
    if (animate) await avatar.playShowAnimation();
    avatar.visible = true;
  }
}
