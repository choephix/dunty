import { __window__ } from "@debug/__window__";
import Airtable from "airtable";
import { Card, CardTarget } from "./CombatState";

Airtable.configure({ endpointUrl: "https://api.airtable.com", apiKey: "key2I1RjdmmcXn495" });
const base = Airtable.base("appHBTWLkIxW5MnWu");

export function loadCards() {
  return new Promise<Card[]>((resolve, reject) => {
    // base("Status Effects | Stacks")
    base("Cards")
      // base("Decks")
      .select({
        // maxRecords: 3,
        // view: "Full list",
        cellFormat: "json",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          __window__.records = records;

          const cards: Card[] = records.map(record => {
            return {
              name: String(record.fields.Name || "Unknown"),
              type: String(record.fields.Type || "func"),
              target: (record.fields.Target as any) || CardTarget.SELF,
              cost: +(record.fields.Cost || 0),
              mods: record.fields.Mods && JSON.parse(String(record.fields.Mods)),
              value: Number(record.fields.Value || 0),
              isToken: !!record.fields.isToken,
              isBloat: !!record.fields.isBloat,
              textureUrl: (record.fields.Attachments as any[])?.[0]?.url || undefined,
            };
          });

          resolve(cards);

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          // fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  });
}
