import { GameSingletons } from "@game/app/GameSingletons";
import { getRandomItemFrom } from "@sdk/helpers/arrays";
import { deleteUndefinedObjectProperties } from "@sdk/helpers/objects";
import { debounce } from "@sdk/utils/callbacks/debounce";
import { AvatarBadgePreferences } from "./avatar/AvatarBadgePreferences";
import { AvatarBadgeElements } from "@game/ui/social/avatar/AvatarBadgeElements";
import { ContractName } from "@sdk-integration/contracts";

export class SocialProfileDataService {
  async getHighlightedMedals(username: string) {
    const test = [false, false, false, false, false];
    return test;
  }

  async getAchievementsInfoData(username: string) {
    return [] as { color: number; label: string }[];
  }

  async getProfileInfoData(username: string) {
    const {
      mapData,
      contracts,
      historyDataCtrl: { api },
    } = GameSingletons.getGameContext();
    const ownedStations = mapData.stationsArray.filter(s => s.ownerName === username);

    const trainRows = await contracts.tables.loadRows("trains", { scope: username, limit: 200 }, ContractName.RR);
    const trainsCount = trainRows?.length || 0;

    const getLogRuns = () => api.getRailRunsStats({ railroader: username, limit: 1, order: "asc", simple: true });
    const [logrun] = (await getLogRuns()) || [];
    const railroaderSince = logrun?.run_start ? new Date(logrun.run_start * 1000) : "--";

    const rrstats = await api.getRailroaderStats(username);
    const distanceTraveled = rrstats?.total_distance || "--";

    const infoData = {
      railroaderSince,
      npcEncounters: "--",
      achievements: "--",
      numberOfStations: `${ownedStations.length}`,
      distanceTraveled: `${distanceTraveled}`,
      numberOfTrains: `${trainsCount} ${trainsCount === 1 ? "train" : "trains"}`,
      stations: ownedStations,
    };
    return infoData;
  }

  // --// --// --// --// --// --// --// --// --// --// --// --// --//

  async getMiscProfilePreferences(username: string, editable: boolean = false) {
    const { firebase } = GameSingletons.getGameContext();

    const firebaseData = (await firebase.getSocialData(username))?.miscProfilePreferences;
    const data = deleteUndefinedObjectProperties({ tagline: "", ...firebaseData });
    if (firebaseData == undefined) {
      await firebase.updateSocialData({ miscProfilePreferences: data });
    }

    if (!editable) {
      return data;
    }

    const updateFirestore = debounce(miscProfilePreferences => firebase.updateSocialData({ miscProfilePreferences }));
    return new Proxy(data, {
      set(target, prop: keyof typeof data, value) {
        Object.assign(target, { [prop]: value });
        updateFirestore(target);
        return true;
      },
    });
  }

  /**
   * Cached the avatar preferences after first load
   */
  #avatarBadgePreferences?: AvatarBadgePreferences;
  async getMyAvatarBadgePreferences(editable: boolean = false) {
    const { firebase } = GameSingletons.getGameContext();

    if (this.#avatarBadgePreferences == undefined) {
      const firebaseData = (await firebase.getSocialData())?.avatarBadgePreferences;
      this.#avatarBadgePreferences = deleteUndefinedObjectProperties({
        ...this.getRandomAvatarBadgePreferences(),
        ...firebaseData,
      });
      if (firebaseData == undefined) {
        await firebase.updateSocialData({ avatarBadgePreferences: this.#avatarBadgePreferences });
      }
    }

    if (!editable) {
      return this.#avatarBadgePreferences;
    }

    const updateFirestore = debounce((avatarBadgePreferences: AvatarBadgePreferences) =>
      firebase.updateSocialData({ avatarBadgePreferences })
    );
    return new Proxy(this.#avatarBadgePreferences!, {
      set(target: AvatarBadgePreferences, prop: keyof AvatarBadgePreferences, value) {
        Object.assign(target, { [prop]: value });
        updateFirestore(target);
        return true;
      },
    });
  }

  async getAvatarBadgePreferences(username: string) {
    const { firebase } = GameSingletons.getGameContext();

    const firebaseData = (await firebase.getSocialData(username))?.avatarBadgePreferences;
    const data = deleteUndefinedObjectProperties({ ...this.getRandomAvatarBadgePreferences(), ...firebaseData });
    if (firebaseData == undefined) {
      await firebase.updateSocialData({ avatarBadgePreferences: data }, username);
    }

    return data;
  }

  getRandomAvatarBadgePreferences(): AvatarBadgePreferences {
    const colors = AvatarBadgeElements.Colors[Math.round(Math.random())];
    const allowedFrames = AvatarBadgeElements.Frames;
    const allowedForegrounds = AvatarBadgeElements.Foregrounds;
    const allowedBackgrounds = AvatarBadgeElements.Backgrounds;
    const allowedNameplateBases = AvatarBadgeElements.NameplateBases;
    const allowedNameplateRims = AvatarBadgeElements.NameplateRims;
    return {
      foregroundImage: getRandomItemFrom(allowedForegrounds),
      backgroundImage: getRandomItemFrom(allowedBackgrounds),
      backgroundColor: getRandomItemFrom(colors),
      frameImage: getRandomItemFrom(allowedFrames),
      frameColor: getRandomItemFrom(colors),
      nameplateBaseImage: getRandomItemFrom(allowedNameplateBases),
      nameplateBaseColor: getRandomItemFrom(colors),
      nameplateRimImage: getRandomItemFrom(allowedNameplateRims),
      nameplateRimColor: getRandomItemFrom(colors),
    };
  }

  // getPlainAvatarBadgePreferences(): AvatarBadgePreferences {
  //   const DEfAULT_COLOR = AvatarBadgeElements.Colors[0];
  //   return {
  //     foregroundImage: AvatarBadgeElements.Foregrounds[0],
  //     backgroundImage: AvatarBadgeElements.Backgrounds[0],
  //     backgroundColor: DEfAULT_COLOR,
  //     frameImage: AvatarBadgeElements.Frames[0],
  //     frameColor: DEfAULT_COLOR,
  //     nameplateBaseImage: AvatarBadgeElements.NameplateBases[0],
  //     nameplateBaseColor: DEfAULT_COLOR,
  //     nameplateRimImage: AvatarBadgeElements.NameplateRims[0],
  //     nameplateRimColor: DEfAULT_COLOR,
  //   };
  // }
}
