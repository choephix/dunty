import { GameSingletons } from "@game/app/GameSingletons";
import { ThemeColors } from "@game/constants/ThemeColors";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { fitObjectInRectangle } from "@sdk-pixi/layout/fitObjectInRectangle";
import { buttonizeDisplayObject } from "@sdk-pixi/ui-helpers/buttonizeDisplayObject";
import { formatGroupThousands } from "@sdk-ui/utils/formatToMaxDecimals";
import { StoryChapterData } from "./StoryDataService";

export class StoryChapterListItem extends Container {
  private readonly simpleFactory = GameSingletons.getSimpleObjectFactory();
  private readonly assets = GameSingletons.getResources();

  constructor(chapter: StoryChapterData, public readonly play: (encounter_id: string, isReplay: boolean) => void) {
    super();
    let unlockedAlpha;
    //// Add encounters
    let startY = 18;
    for (const key in chapter.encounters) {
      let textColor = 0xffffff;
      unlockedAlpha = 0.5;

      //// Check if encounter unlocked
      if (chapter.encounters[key].unlocked) {
        let btn;
        unlockedAlpha = 1;
        textColor = ThemeColors.HIGHLIGHT_COLOR_LIGHT2.toInt();
        //// Check if encounter is playable or reloadable
        if (chapter.encounters[key].reload) {
          btn = this.simpleFactory.createSprite(
            this.assets.getTexture("ui-railroader-dashboard/page-story/reload.png")
          );
          buttonizeDisplayObject(btn, () => this.play(chapter.encounters[key].encounterId, true));
        } else {
          btn = this.simpleFactory.createSprite(this.assets.getTexture("ui-railroader-dashboard/page-story/play.png"));
          buttonizeDisplayObject(btn, () => this.play(chapter.encounters[key].encounterId, false));
        }
        btn.scale.set(0.6);
        btn.anchor.set(0.5);

        btn.position.set(510, startY + 12);
        this.addChild(btn);
      }

      //// Skip first line
      if (parseInt(key) == 0) {
        //// Add first overhead line
        const graphics1 = new Graphics().lineStyle(1, 0x707070).moveTo(10, 10).lineTo(532, 10);
        graphics1.alpha = unlockedAlpha;
        this.addChild(graphics1);

        //// Add title
        const title = this.simpleFactory.createText(
          chapter.title.toUpperCase(),
          {
            fontSize: 15,
          },
          {
            alpha: unlockedAlpha,
          }
        );
        fitObjectInRectangle(title, {
          x: 0,
          y: 50,
          width: 200,
          height: 25,
        });
        this.addChild(title);
      } else {
        //// Add regular overhead line
        const graphics2 = new Graphics()
          .lineStyle(1, 0x707070)
          .moveTo(200, 11 + +key * 36)
          .lineTo(532, 11 + +key * 36);
        graphics2.alpha = unlockedAlpha;
        this.addChild(graphics2);
      }

      const encounterTitle = this.simpleFactory.createText(
        chapter.encounters[key].name,
        {
          fontSize: 18,
        },
        {
          alpha: unlockedAlpha,
        }
      );

      //// Add encounter name
      fitObjectInRectangle(encounterTitle, {
        x: 250,
        y: startY,
        width: 50,
        height: 21,
      });
      this.addChild(encounterTitle);
      const encounterDistance = this.simpleFactory.createText(
        formatGroupThousands(chapter.encounters[key].distance),
        {
          fill: textColor,
          fontSize: 18,
        },
        {
          alpha: unlockedAlpha,
        }
      );
      fitObjectInRectangle(encounterDistance, {
        x: 420,
        y: startY,
        width: 65,
        height: 21,
      });

      //// Add encounter req distance
      this.addChild(encounterDistance);
      startY += 36;
    }
  }
}
