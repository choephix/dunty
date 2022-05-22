import { AvatarBadge } from "../avatar/AvatarBadge";
import { AvatarBadgePreferences } from "@game/ui/social/avatar/AvatarBadgePreferences";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";

export class AvatarBadgePreferencesController {
  constructor(public readonly avatar: AvatarBadge, public readonly preferences: AvatarBadgePreferences) {
    this.preferences = new Proxy(preferences, {
      set: (target, prop: keyof AvatarBadgePreferences, value) => {
        //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////
        value = /https:\/\/train-of-the-century-media\.web\.app\/social\/.+\/(.+)\.png/gi.exec(value)?.[1] || value;
        //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP //// TEMP ////

        Object.assign(target, { [prop]: value });
        switch (prop) {
          case "foregroundImage":
            avatar.setForegroundImage(AvatarBadgeElements.getForegroundTextureId(value));
            break;
          case "backgroundImage":
            avatar.setBackgroundImage(AvatarBadgeElements.getBackgroundTextureId(value));
            break;
          case "backgroundColor":
            avatar.setBackgroundTint(value);
            break;
          case "frameImage":
            avatar.setFrameImage(AvatarBadgeElements.getFrameTextureId(value));
            break;
          case "frameColor":
            avatar.setFrameTint(value);
            break;
          case "nameplateRimImage":
            avatar.setNameplateFrameImage(AvatarBadgeElements.getNameplateTextureId(value));
            break;
          case "nameplateRimColor":
            avatar.setNameplateFrameTint(value);
            break;
          case "nameplateBaseImage":
            avatar.setNameplateImage(AvatarBadgeElements.getNameplateTextureId(value));
            break;
          case "nameplateBaseColor":
            avatar.setNameplateTint(value);
            break;
        }
        return true;
      },
    });
  }
}
