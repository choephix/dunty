import { GameSingletons } from "@game/app/GameSingletons";
import type { CardEntity } from "@game/data/entities/CardEntity";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { lerp } from "@sdk/utils/math";
import { createValueAnimator_OutInViaTimeline } from "../common/createValueAnimator_OutInViaTimeline";
import { CardsDrawerGroupData } from "./CardDrawerGroupData";
import { CardsDrawerGroup } from "./CardsDrawerGroup";
import type { CardSprite } from "./CardSprite";

export class CardsDrawer {
  private readonly context = GameSingletons.getGameContext();

  public readonly container: Container;
  public readonly dimmy: Sprite;
  public readonly bg: Sprite;
  public readonly pipe?: Sprite;
  public readonly pipeCap?: Sprite;

  public readonly cardSpritesPool = new Map<CardEntity.AssetId, CardSprite>();
  clearCardSpritesPool() {
    for (const cardSprite of this.cardSpritesPool.values()) {
      cardSprite.destroy({ children: true });
    }
    this.cardSpritesPool.clear();
  }

  public readonly groups = new Array<CardsDrawerGroup>();

  public readonly expansion = {
    progress: 0,
    isExpanded: false,
  };

  protected readonly animator = createValueAnimator_OutInViaTimeline(
    {
      howToShow: tl => {
        const { expansion } = this;
        expansion.isExpanded = true;
        tl.to(expansion, {
          progress: 1,
          duration: 0.45,
          ease: "power3.out",
        });
      },
      howToHide: tl => {
        const { expansion } = this;
        expansion.isExpanded = false;
        tl.to(expansion, {
          progress: 0,
          duration: 0.25,
          ease: "power.out",
        });
      },
      howToApplyValue: data => {
        this.setGroupsData(data);
      },
    },
    null as CardsDrawerGroupData[] | null
  );

  get isOpen() {
    return this.expansion.isExpanded;
  }

  constructor(public readonly getDrawerRangeX: () => [number, number]) {
    const { assets, ticker, viewSize, animator } = this.context;

    this.container = new Container();
    this.container.zIndex = 24;
    this.container.sortableChildren = true;

    this.dimmy = new Sprite(assets.getTexture("gradUpBlack"));
    this.dimmy.zIndex = -10;
    this.dimmy.width = 1024;
    this.dimmy.height = 1024;
    this.container.addChild(this.dimmy);

    this.bg = new Sprite(assets.getTexture("cardsBg"));
    this.bg.anchor.set(0.0, 1.0);
    this.bg.zIndex = -3;
    this.container.addChild(this.bg);

    this.pipe = new Sprite(assets.getTexture("ui-cards-drawer/pipe.png"));
    this.pipe.anchor.set(0.0, 0.5);
    this.pipe.zIndex = -2;
    this.container.addChild(this.pipe);

    this.pipeCap = new Sprite(assets.getTexture("ui-cards-drawer/pipe-cap.png"));
    this.pipeCap.anchor.set(0.5);
    this.pipeCap.scale.set(1 / 3);
    this.pipeCap.zIndex = -1;
    this.container.addChild(this.pipeCap);

    // __DEBUG__ && debugCardsDrawer(this);
  }

  initialize() {
    this.context.ticker.add(this.updateContainerChildren, this);
  }

  refreshGroupsCards() {
    for (const group of this.groups) {
      group.updateCardSprites();
    }
  }

  setGroupsData(data: CardsDrawerGroupData[] | null) {
    const { groups, container, context } = this;

    for (const group of groups) {
      group.onDestroy.forEach(o => (typeof o === "function" ? o() : !o.destroyed && o.destroy()));
    }
    groups.length = 0;

    this.clearCardSpritesPool();

    if (!data || !data.length) {
      return;
    }

    for (const groupData of data) {
      const group = new CardsDrawerGroup(groupData, this.cardSpritesPool);
      groups.push(group);
      container.addChild(...group.iterateDisplayObjects());
      container.sortChildren();
    }

    this.updateContainerChildren();

    // const cardsDrawerFilterPanel = new CardsDrawerFilterPanel(
    //   this.context,
    //   (filterSelections: CardFilterSelections) => {
    //     console.log(filterSelections);
    //   }
    // );
    // cardsDrawerFilterPanel.position.set(450, 550);
    // container.addChild(cardsDrawerFilterPanel);
  }

  setGroupsDataAnimatedly(data: CardsDrawerGroupData[] | null) {
    this.animator.setValue(data);
  }

  updateContainerChildren() {
    const { groups, bg, dimmy } = this;
    const { viewSize } = this.context;

    const { width, height } = viewSize;
    const {
      expansion: { progress: expansionProgress },
    } = this;

    const cardsHiddenX = width + 200;

    const [drawerBoundryLeft, drawerBoundryRight] = this.getDrawerRangeX();
    const drawerBoundryWidth = drawerBoundryRight - drawerBoundryLeft;

    {
      const marginBottom = this.pipe ? 6 : 26;
      bg.scale.set(drawerBoundryWidth / 1536);
      bg.position.set(lerp(width + bg.width, drawerBoundryLeft, expansionProgress), height - marginBottom);
    }

    if (this.pipe) {
      this.pipe.position.set(width, height - 40);
      this.pipe.x = bg.getBounds().left;
      this.pipe.width = bg.width;
      this.pipe.height = this.pipe.texture.height * 0.45;

      if (this.pipeCap) {
        this.pipeCap.position.copyFrom(this.pipe.position);
        this.pipeCap.rotation = expansionProgress * Math.PI * 4;
      }
    }

    {
      const DIMMY_HEIGHT_MUL = 0.5;
      const DIMMY_ALPHA_MAX = 0.65;
      dimmy.width = width;
      dimmy.height = height * DIMMY_HEIGHT_MUL;
      dimmy.position.set(0, height * (1.0 - DIMMY_HEIGHT_MUL));
      dimmy.alpha = DIMMY_ALPHA_MAX * expansionProgress * expansionProgress;
    }

    // const groupsCount = groups.length;
    // const groupSectionWidth = (drawerBoundryRight - drawerBoundryLeft) / groupsCount;
    // const groupBoundryMaxWidth = groupsCount > 1 ? 480 : groupSectionWidth;
    // const groupBoundryWidth = Math.min(groupSectionWidth, groupBoundryMaxWidth);

    const groupsWidthWeigthsSum = groups.reduce((sum, group) => sum + group.widthWeight, 0);
    let xPointer = drawerBoundryLeft;

    for (const [groupIndex, group] of groups.entries()) {
      const widthWeightFraction = group.widthWeight / groupsWidthWeigthsSum;
      const groupSectionWidth = (drawerBoundryRight - drawerBoundryLeft) * widthWeightFraction;
      const groupBoundryWidth = groupSectionWidth;

      const grounBoundryCenter = xPointer + groupSectionWidth * 0.5;
      const [groupBoundryLeft, groupBoundryRight] = [
        grounBoundryCenter - groupBoundryWidth * 0.5,
        grounBoundryCenter + groupBoundryWidth * 0.5,
      ];

      group.zone.width = groupBoundryWidth;
      group.zone.height = Math.min(height * 0.4, width * 0.4);
      group.zone.x = groupBoundryLeft;
      group.zone.y = height - group.zone.height;
      group.arrangeCardSprites(expansionProgress);

      const { titleLabel, plusButton } = group;

      //// Update title label

      if (titleLabel) {
        const maxTitleLabelWidth = 480;
        titleLabel.setWidth(Math.min(groupBoundryWidth, maxTitleLabelWidth) * 0.85);
        const x = lerp(cardsHiddenX, grounBoundryCenter, expansionProgress);
        const y = height - 40;
        titleLabel.position.set(x, y);
      }

      //// Update [+] button

      if (plusButton) {
        const x = lerp(cardsHiddenX, grounBoundryCenter, expansionProgress);
        const y = height - 130;
        plusButton.position.set(x, y);
      }

      xPointer += groupSectionWidth;

      for (const cardSprite of group.cardSprites) {
        if (!cardSprite.parent) {
          this.container.addChild(cardSprite);
          this.container.sortChildren();
        }
      }
    }
  }
}
