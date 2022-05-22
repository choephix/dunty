import { GameSingletons } from "@game/app/GameSingletons";
import { GameViewMode } from "@game/app/main";
import { createAnimatedButtonBehavior } from "@game/asorted/createAnimatedButtonBehavior";
import { Container } from "@pixi/display";
import { BitmapText } from "@pixi/text-bitmap";
import { AvatarBadge } from "../social/avatar/AvatarBadge";

type AvatarBadgeWithViewProfileButton = AvatarBadge & { viewProfileButton?: Container };

export class HUDAvatarBadgeController {
  private readonly context = GameSingletons.getGameContext();

  private current: AvatarBadgeWithViewProfileButton | null = null;

  public get hasInstanceUp() {
    return this.current != null;
  }

  constructor(private readonly parent: Container) {}

  initialize() {
    const { stage, main, userData } = this.context;

    stage.enchantments.watch(
      () => {
        const selectedStation = main.selection.selectedStation;
        if (selectedStation == null) return null;
        const result =
          main.viewMode === GameViewMode.NORMAL &&
          selectedStation != null &&
          selectedStation.ownerName !== userData.name &&
          main.popups.clickUnrelated.currentPopup?.isExpanded &&
          !main.popups.clickWithMyTrain.currentPopup?.isExpanded;
        !main.cards.drawer.isOpen;
        return result ? selectedStation : null;
      },
      selectedStation => {
        this.removeCurrentInstance();

        if (selectedStation == null) return;

        this.addInstance(selectedStation.ownerName);
      }
    );
  }

  async addInstance(username: string) {
    const avatar = new AvatarBadge() as AvatarBadgeWithViewProfileButton;
    avatar.tweeener.onEveryFrame(this.updatePosition.bind(this, avatar));

    this.current = avatar;

    if (avatar.nameplate.braggingTitle?.useFlareAnimation) {
      avatar.nameplate.braggingTitle.useFlareAnimation = false;
    }

    avatar.viewProfileButton = this.addViewProfileButton(avatar, username);

    await AvatarBadge.applyUserData(avatar, username);

    this.parent.addChild(avatar);
    avatar.tweeener.from(avatar, { pixi: { pivotX: 100 }, duration: 0.65, ease: "power3.out" });

    await AvatarBadge.showWhenFullyLoaded(avatar);
  }

  addViewProfileButton(parent: Container, username: string) {
    //// Add view profile button
    const viewProfileButton = this.context.simpleFactory.createSprite("ui-social/right-panel/expanded/btn.png");
    viewProfileButton.tint = 0x023438;
    viewProfileButton.pivot.set(viewProfileButton.texture.width * 0.5, viewProfileButton.texture.height * 0.5);
    viewProfileButton.position.set(480, 1100);
    viewProfileButton.scale.set(1.9);
    parent.addChild(viewProfileButton);

    const viewBtnText = new BitmapText("view profile", { fontName: "Celestial Typeface", align: "center" });
    viewBtnText.scale.set(0.75);
    viewBtnText.position.set(75, 0);
    viewProfileButton.addChild(viewBtnText);

    createAnimatedButtonBehavior(viewProfileButton, {
      onClick: () => {
        this.removeCurrentInstance();
        this.context.main.closeEverything();
        this.context.input.dispatch("openSocialProfilePanel", username);
      },
    });

    return viewProfileButton;
  }

  updatePosition(target: AvatarBadge) {
    const { width: viewWidth, height: viewHeight } = this.context.viewSize;
    target.scale.set(Math.min(viewHeight / 4000, viewWidth / 4000));
    target.position.set(30, viewHeight - target.height - 110);
  }

  removeCurrentInstance() {
    const prev = this.current;
    if (prev) {
      this.current = null;

      prev.viewProfileButton?.destroy();
      prev.playHideAnimation().then(() => prev.destroy());
    }
  }
}
