import { FontFamily } from "@game/constants/FontFamily";
import { FontIcon } from "@game/constants/FontIcon";
import { RailRunEntity } from "@game/data/entities/RailRunEntity";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { ITextStyle, Text } from "@pixi/text";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";

export interface RailRunReportStats {
  distance: string;
  fuelCost: string;
  duration: string;
}

export function createRailRunReportTable(
  formattedStats: RailRunReportStats,
  stats: ReadonlyObjectDeep<{ reward: number } & RailRunEntity>,
  assetLine: Texture
) {
  const table = new Container();
  let longestWord = 0;
  let startX = 0;

  function makeText(t: string, fontSize: number = 28) {
    const style = {
      fontFamily: FontFamily.Default,
      fontSize: fontSize,
      align: "center",
      fill: 0xffffff,
    } as ITextStyle;
    const label = new Text(t.trim(), style);
    table.addChild(label);
    label.updateText(false);
    label.anchor.set(0.5);
    return label;
  }

  function makeRow(t: string, xPoint: number, align?: string, fontSize?: number) {
    const row = makeText(t, fontSize);
    if (align == "left") {
      row.anchor.x = 0;
    } else if (align == "right") {
      row.anchor.x = 1;
    }
    row.x = xPoint;
    if (row.width > longestWord) {
      longestWord = row.width;
      startX = row.x + row.width * 2;
    }
    return row;
  }

  const rowHeight = 40;

  const primaryLine1 = new Sprite(assetLine);
  primaryLine1.anchor.set(0.5, 0);
  table.addChild(primaryLine1);

  const primaryLine2 = new Sprite(assetLine);
  primaryLine2.anchor.set(0.5, 0);
  table.addChild(primaryLine2);

  const primary = makeText("PRIMARY", 36);

  primaryLine1.x = primary.x - primary.width * 1.35;
  primaryLine2.x = primary.x + primary.width * 1.35;
  const distance = makeRow("DISTANCE:", primary.x - primary.width * 1.25, "left");

  const duration = makeRow("DURATION:", primary.x - primary.width * 1.25, "left");

  const fuelCost = makeRow("FUEL USED:", primary.x - primary.width * 1.25, "left");
  distance.y += rowHeight * 2;
  const distanceData = makeRow(`${formattedStats.distance}`, startX, "right");
  distanceData.y = distance.y;
  duration.y += rowHeight * 3;
  const durationData = makeRow(`${formattedStats.duration}`, startX, "right");
  durationData.y = duration.y;
  fuelCost.y += rowHeight * 4;
  const fuelCostData = makeRow(`${formattedStats.fuelCost}`, startX, "right");
  fuelCostData.y = fuelCost.y;

  const total = makeRow(
    `TOTAL: ${FontIcon.Tocium} ${formatToMaxDecimals(stats.reward, 1, true)}`,
    primary.x + primary.width * 0.1,
    "center",
    48
  );
  total.y += rowHeight * 6 + total.height;

  return table;
}
