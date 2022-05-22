import { GameSingletons } from "@game/app/GameSingletons";
import { FontFamily } from "@game/constants/FontFamily";
import { Dropdown } from "@game/ui/components/Dropdown";
import { Slider } from "@game/ui/components/slider/Slider";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { getRpcEndpointHost, RPC_ENDPOINT_HOST_OPTIONS, setRpcEndpointHost } from "@sdk-integration/configuration";
import { RailroaderDashPanelBase } from "../RailroaderDashPanelBase";
import { GreenButton } from "./components/GreenButton";

export class SettingsCenterPanel extends RailroaderDashPanelBase {
  private readonly controlsContainer = new Container();
  private readonly context = GameSingletons.getGameContext();
  init() {
    const { assets, music, sfx, input } = this.context;

    //// Logo image
    this.addTitleImage("ui-railroader-dashboard/page-settings/img-settings.png");

    this.controlsContainer.position.set(88, -50);
    this.addChild(this.controlsContainer);

    //// Sound Text
    const soundText = this.context.simpleFactory.createText("SOUND", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    soundText.position.set(100, 400);
    this.controlsContainer.addChild(soundText);

    //// SFX Text
    const sfxText = this.context.simpleFactory.createText("FX", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    sfxText.position.set(165, 450);
    this.controlsContainer.addChild(sfxText);

    //// SFX Slider Placeholder
    const sfxPlaceholder = this.createSlider(
      VolumeCurver.uncurve(sfx.getVolume()),
      value => {
        sfx.setVolume(VolumeCurver.curve(value), true);
      },
      150
    );
    sfxPlaceholder.position.set(235, 465);
    this.controlsContainer.addChild(sfxPlaceholder);

    //// Music Text
    const musicText = this.context.simpleFactory.createText("MUSIC", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    musicText.position.set(430, 450);
    this.controlsContainer.addChild(musicText);

    //// FX Music Placeholder
    const musicPlaceholder = this.createSlider(
      VolumeCurver.uncurve(music.getVolume()),
      value => {
        music.volume = VolumeCurver.curve(value);
      },
      150
    );
    musicPlaceholder.position.set(550, 465);
    this.controlsContainer.addChild(musicPlaceholder);

    //// WAX Endpoint Text
    const waxText = this.context.simpleFactory.createText("WAX ENDPOINT", {
      fontFamily: FontFamily.Default,
      fontSize: 30,
      fill: 0xffffff,
    });
    waxText.position.set(100, 335);
    this.controlsContainer.addChild(waxText);

    //// WAX Endpoint Placeholder

    {
      const currentEndpoint = getRpcEndpointHost();
      const endpoints = RPC_ENDPOINT_HOST_OPTIONS;
      const endpointDropdown = new Dropdown(
        endpoints.map(endpoint => ({ text: endpoint, value: endpoint })),
        {
          // boxScale: 0.25,
          boxPadding: 21,
          labelPadding: [5, 5, 5, 15],
          horizontalAlignment: 0.0,
          width: 500,
          height: 100,
          labelStyle: {
            fontSize: 22,
          },
          optionsOffset: [0, -30],
          optionsStyle: {
            // boxScale: 0.25,
            horizontalAlignment: 0.0,
            boxPadding: 21,
            labelPadding: [5, 15],
            labelStyle: {
              fontSize: 22,
            },
          },
        },
        endpoints.indexOf(currentEndpoint)
      );
      endpointDropdown.scale.set(0.8);
      endpointDropdown.position.set(335, 315);
      endpointDropdown.onOptionSelected = async endpoint => {
        const choice = await this.context.modals.confirm({
          title: "",
          content: `
          Are you sure you want to change the WAX endpoint to ${endpoint}?
          
          The page will need to refresh to apply the change.`,
        });
        if (choice) {
          setRpcEndpointHost(endpoint);
          location.reload();
        }
      };
      this.controlsContainer.addChild(endpointDropdown);
    }

    //// Log Out Button

    {
      const label = "LOG OUT";
      const width = 480;
      const heightPadding = 15; //height padding is added to top and bottom of text height

      const padWidth = this.pad.width - this.controlsContainer.x - this.controlsContainer.x;
      const centerX = ~~(padWidth / 2);
      const logOutButton = new GreenButton(
        label,
        () => {
          const { sfx, input } = this.context;
          sfx.play("clickRegular");
          input.dispatch("logOut");
        },
        width,
        heightPadding
      );
      logOutButton.pivot.set(logOutButton.width / 2, logOutButton.height / 2);
      logOutButton.position.set(centerX, 750);

      this.controlsContainer.addChildAt(logOutButton, 0);
    }
  }

  createSlider(initialValue: number, onChange: (value: number) => void, width: number = 100, height: number = 30) {
    const { assets, sfx } = this.context;

    const knobSpriteTexture = assets.getTexture("ui-railroader-dashboard/page-settings/slider-gear.png");
    const knobSprite = new Sprite(knobSpriteTexture);

    const barOptions = {
      fill: 0x054053,
      x: 0,
      y: 0,
      width: width,
      height: 5,
    };

    const knobOptions = {
      knobSprite: knobSprite,
    };

    const sliderOptions = {
      barOptions: barOptions,
      knobOptions: knobOptions,
    };

    const slider = new Slider(sliderOptions);

    slider.setValue(initialValue);
    slider.on("change", onChange);
    slider.on("startDrag", () => sfx.play("clickTiny"));

    return slider;
  }
}

/**
 * https://www.dr-lex.be/info-stuff/volumecontrols.html
 *
 */
class VolumeCurver {
  public static curve(value: number) {
    // return Math.sin(value * Math.PI * 0.5);
    return value * value;
  }
  public static uncurve(value: number) {
    // return Math.asin(value) / Math.PI * 0.5;
    return Math.sqrt(value);
  }
}
