import { Container } from "@pixi/display";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { AvatarBadgePreferencesController } from "../AvatarBadgePreferencesController";
import { ColorPicker } from "./ColorPicker";
import { FrameSection } from "./FrameSection";

export class FramePage extends Container {
  private frames: FrameSection;
  constructor(private readonly avatarCtrl: AvatarBadgePreferencesController) {
    super();

    //// Add color picker
    const colorPicker = new ColorPicker();
    colorPicker.position.set(850, 15);
    this.addChild(colorPicker);
    //// Add Frames
    this.frames = new FrameSection();
    this.frames.position.set(25, 50);
    this.addChild(this.frames);
    this.initData();

    //// Add events
    colorPicker.onColorSelected = (color: number) => {
      this.frames.changeColor(color);
      avatarCtrl.preferences.frameColor = color;
    };
    this.frames.onFrameSelected = (frame: string) => {
      avatarCtrl.preferences.frameImage = frame;
    };
  }

  async initData() {
    const currentFrame = this.avatarCtrl.avatar.getCurrentConfiguration().frameImage;
    this.frames.addFrames(
      AvatarBadgeElements.getSortedData(AvatarBadgeElements.Frames, AvatarBadgeElements.canUserUseFrame),
      currentFrame
    );
  }
}
