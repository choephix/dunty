import { GameContext } from "@game/app/app";
import { FontFamily } from "@game/constants/FontFamily";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { ITextStyle, Text } from "@pixi/text";

export interface DataTableOptions {
  columns: {
    header: string;
    width: number;
    align: "left" | "center" | "right";
  }[];
  rows: {
    cells: string[];
    bgColor?: number;
    marginTop?: number;
  }[];
}

export function createDataTable(tableOptions: DataTableOptions) {
  const table = new Container();

  const totalWidth = tableOptions.columns.reduce((acc, c) => acc + c.width, 0);
  table.pivot.x = 0.5 * totalWidth;

  function makeRect(width: number, height: number, color: number) {
    const rect = new Graphics();
    rect.beginFill(color);
    rect.drawRect(0, 0, width, height);
    rect.endFill();
    return rect;
  }

  function makeText(t: string, maxWidth: number) {
    const style = {
      fontFamily: FontFamily.Default,
      fontSize: 32,
      align: "center",
      fill: 0xffffff,
    } as ITextStyle;
    const label = new Text(t.trim(), style);
    table.addChild(label);
    label.updateText(false);
    label.anchor.y = 0.5;

    if (label.width > maxWidth) {
      label.scale.x = maxWidth / label.width;
    }

    return label;
  }

  const rowHeight = 80;
  let yPointer = 0;
  let xPointer = 0;

  for (const columnOptions of tableOptions.columns) {
    const t = makeText(columnOptions.header || "", columnOptions.width);
    t.x = xPointer + (columnOptions.width - t.width) / 2;
    t.y = yPointer + rowHeight * 0.5;
    xPointer += columnOptions.width;
  }

  const divider = makeRect(totalWidth, 4, 0x53585a);
  divider.y = yPointer + rowHeight - divider.height * 0.5;
  table.addChild(divider);

  for (const rowOptions of tableOptions.rows) {
    xPointer = 0;
    yPointer += rowHeight;
    yPointer += rowOptions.marginTop || 0;

    if (rowOptions.bgColor) {
      const rect = makeRect(totalWidth, rowHeight, rowOptions.bgColor);
      rect.y = yPointer;
      table.addChild(rect);
    }

    for (const [cellIndex, cellContent] of rowOptions.cells.entries()) {
      const columnOptions = tableOptions.columns[cellIndex];
      const { align, width: columnWidth } = columnOptions;

      const t = makeText(cellContent || "", columnWidth);
      const margin = columnWidth * 0.05;
      if (align == "left") {
        t.x = xPointer + margin;
      } else if (align == "right") {
        t.x = xPointer + (columnWidth - t.width) - margin;
      } else if (align == "center") {
        t.x = xPointer + (columnWidth - t.width) / 2;
      }
      t.y = yPointer + rowHeight * 0.5;
      xPointer += columnWidth;
    }
  }

  return table;
}
