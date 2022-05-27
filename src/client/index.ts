import "./index.css";

import { Application } from "@pixi/app";

import { boot } from "@client/core/boot";
import { main } from "@client/main";
import { initializeGameSingletons } from "./core/GameSingletons";

const __window__ = window as any;

if (__window__.__DUNTY_INITIALIZED__) {
  console.warn(`An instance of the game already exists.`, __window__.main);
} else {
  console.log("Client initializing...");

  __window__.__DUNTY_INITIALIZED__ = true;

  const greateApp = () => {
    if (!__window__.APP) __window__.APP = boot();
    return __window__.APP as Application;
  };

  const app = greateApp();

  initializeGameSingletons(app);

  main(app);
}

import Airtable from "airtable";
Airtable.configure({ endpointUrl: "https://api.airtable.com", apiKey: "key2I1RjdmmcXn495" });
const base = Airtable.base("appHBTWLkIxW5MnWu");
// base("Status Effects | Stacks")
// base("Cards")
base("Decks")
  .select({
    // maxRecords: 3,
    // view: "Full list",
    cellFormat: "json",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        console.log("Retrieved", record.fields);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
