import { GameSingletons } from "@game/app/GameSingletons";
import { createEnchantedFrameLoop } from "@game/asorted/createEnchangedFrameLoop";
import { createTickButton } from "@game/ui/components/createTickButton";
import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { RailroaderDashPanelBase } from "../../railroader-dash/panels/RailroaderDashPanelBase";
import { AvatarBadge } from "../avatar/AvatarBadge";
import { AvatarBadgePreferencesController } from "../components/AvatarBadgePreferencesController";
import { AvatarEdit } from "../components/editComponents/AvatarEdit";
import { AvatarPreview } from "../components/editComponents/AvatarPreview";
import { SocialProfileDataService } from "../SocialProfileDataService";

export class EditRRBadgePanel extends RailroaderDashPanelBase {
  private readonly dataService: SocialProfileDataService = new SocialProfileDataService();

  public readonly onEnterFrame = createEnchantedFrameLoop(this);

  async init(username: string = GameSingletons.getGameContext().userData.name): Promise<void> {
    const { firebase, modals, spinner } = GameSingletons.getGameContext();

    this.pad.texture = this.assets.getTexture("ui-social/center-panel.png");

    const plaqueMessage =
      "You must hold at least 1 of a character's NFTs in your wallet to display them in your badge. Staking will also invalidate them.";
    const plaque = this.addGreenPlaque({ message: plaqueMessage });
    this.addChild(plaque);

    //// Avatar preview
    const avatarPreview = new AvatarPreview();
    avatarPreview.position.set(155, 65);
    this.addChild(avatarPreview);

    avatarPreview.avatar.visible = false;

    AvatarBadge.applyMyUserData(avatarPreview.avatar);

    const preferences = await spinner.showDuring(this.dataService.getMyAvatarBadgePreferences(false));
    AvatarBadge.applyPreferences(avatarPreview.avatar, preferences!);

    const highlightedMedalsData = await this.dataService.getHighlightedMedals(username);
    for (let [index, element] of highlightedMedalsData.entries()) {
      avatarPreview.setMedalArcHightlight(element, index);
    }

    await GameSingletons.getTicker().delay(0.55);

    AvatarBadge.showWhenFullyLoaded(avatarPreview.avatar);

    //// Avatar editing pane
    const avatarCtrl = new AvatarBadgePreferencesController(avatarPreview.avatar, preferences!);

    let editPane: AvatarEdit | undefined;
    const addEditingPane = () => {
      editPane = new AvatarEdit(avatarCtrl);
      editPane.position.set(155, 555);
      editPane.scale.set(0.7);
      this.addChild(editPane);

      const tweeener = new TemporaryTweeener(editPane);
      tweeener.from(editPane, { alpha: 0, duration: .8 });
    }
    const destroyEditingPane = () => {
        editPane?.destroy({ children: true});
        editPane = undefined;
    }
    addEditingPane();

    //// Add [SAVE] button

    const saveButton = createTickButton(0x168f99);
    saveButton.position.set(755, 120);
    saveButton.behavior.on({
      trigger: async () => {
        destroyEditingPane();

        await spinner.showDuring(firebase.updateSocialData({ avatarBadgePreferences: preferences }));
        await modals.alert({
          title: "Saved!",
          content: "Your avatar badge preferences have been saved.",
        });

        originalPreferencesJson = JSON.stringify(preferences);
        
        addEditingPane();
      },
    });
    this.addChild(saveButton);

    let originalPreferencesJson = JSON.stringify(preferences);
    this.onEnterFrame.watch(
      () => originalPreferencesJson !== JSON.stringify(preferences),
      changed => {
        // changed ? saveButton.playShowAnimation() : saveButton.playHideAnimation();
        // saveButton.visible = changed;
        saveButton.tweeener.to(saveButton, { alpha: changed ? 1 : 0, duration: 0.25 });
        saveButton.interactive = changed;
      },
      true
    );
    saveButton.alpha = 0;
  }
}
