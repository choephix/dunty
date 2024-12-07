import { TemporaryTweeener } from "@sdk/pixi/animations/TemporaryTweener";
import { spawnSpriteWave } from "@sdk-pixi/asorted/animations/spawnSpriteWave";
import { BLEND_MODES } from "@pixi/constants";
import { Text } from "@pixi/text";
import { delay } from "@sdk/utils/promises";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
function spawnBlobOfLight(parent, tint) {
    const fx = spawnSpriteWave("https://undroop-assets.web.app/davinci/3/radial-4.png", { pixi: { scale: 2.7 }, duration: 2 }, { tint: tint, blendMode: BLEND_MODES.ADD });
    return parent.addChild(fx);
}
function spawnFlazma(parent, tint, scale = 0.7) {
    const fx = spawnSpriteWave("https://undroop-assets.web.app/davinci/3/plazmo-6.png", { pixi: { scale } }, { tint: tint, blendMode: BLEND_MODES.ADD });
    return parent.addChild(fx);
}
function spawnFlare1(parent, tint) {
    const fx = spawnSpriteWave("https://undroop-assets.web.app/davinci/2/ring-w.png", { pixi: { scale: 0.99 }, duration: 3 }, { tint: tint, blendMode: BLEND_MODES.ADD });
    return parent.addChild(fx);
}
async function blinkThought(vunit, thought) {
    vunit.thought = thought;
    await delay(0.07);
    vunit.thought = undefined;
    await delay(0.07);
    vunit.thought = thought;
    await delay(0.07);
    vunit.thought = undefined;
    await delay(0.07);
    vunit.thought = thought;
    await delay(0.2);
    vunit.thought = undefined;
    await delay(0.07);
}
export var VCombatantAnimations;
(function (VCombatantAnimations) {
    function enter(unit) {
        const direction = unit.sprite.scale.x < 0 ? 1 : -1;
        const tweeener = new TemporaryTweeener(unit);
        return tweeener.from(unit, {
            pixi: { pivotX: direction * 200 },
        });
    }
    VCombatantAnimations.enter = enter;
    async function attack(unit) {
        const direction = unit.sprite.scale.x < 0 ? 1 : -1;
        const tweeener = new TemporaryTweeener(unit);
        await tweeener.to(unit, {
            pixi: { pivotX: -direction * 140 },
            repeat: 1,
            yoyo: true,
            duration: 0.1,
            ease: `power2.in`,
        });
    }
    VCombatantAnimations.attack = attack;
    async function spellBegin(unit) {
        console.log(`${unit.name} is casting a spell`);
        const tweeener = new TemporaryTweeener(unit);
        await tweeener.to(unit, {
            pixi: { pivotY: 4 },
            repeat: 1,
            yoyo: true,
            duration: 0.1,
            ease: `power.out`,
        });
        await delay(0.1);
    }
    VCombatantAnimations.spellBegin = spellBegin;
    async function buff(unit) {
        console.log(`${unit.name} is buffing`);
        spawnBlobOfLight(unit, 0x0603ff);
        // spawnFlazma(unit, 0x0906ff, );
        // spawnFlare1(unit, 0xFFFFFF);
        await delay(0.1);
    }
    VCombatantAnimations.buff = buff;
    async function buffHealth(unit) {
        console.log(`${unit.name} is buffing health`);
        spawnFlare1(unit, 0xffffff);
        spawnBlobOfLight(unit, 0x91f140);
        await delay(0.2);
    }
    VCombatantAnimations.buffHealth = buffHealth;
    async function buffRetaliation(unit) {
        console.log(`${unit.name} is buffing retaliation`);
        spawnBlobOfLight(unit, 0xff0000);
        spawnFlazma(unit, 0x902040, 1.2);
        await delay(0.2);
    }
    VCombatantAnimations.buffRetaliation = buffRetaliation;
    async function buffBlock(unit) {
        console.log(`${unit.name} is buffing block`);
        const fx = spawnSpriteWave("https://undroop.web.app/dunty/asorted/shield-blur.png", { pixi: { scale: 0.95 }, duration: 1.2, ease: "power5.out" }, { tint: 0x3060a0, blendMode: BLEND_MODES.SCREEN });
        unit.addChild(fx);
        const tweeener = new TemporaryTweeener(unit);
        await tweeener.to(unit, {
            pixi: { pivotY: 4 },
            repeat: 1,
            yoyo: true,
            duration: 0.15,
            ease: `power2.out`,
        });
    }
    VCombatantAnimations.buffBlock = buffBlock;
    async function hurt(unit) {
        console.log(`${unit.name} is hurt`);
        const direction = unit.sprite.scale.x < 0 ? 1 : -1;
        const tweeener = new TemporaryTweeener(unit);
        await tweeener.to(unit, {
            pixi: { alpha: 0.6, pivotX: direction * 40 },
            repeat: 1,
            yoyo: true,
            delay: 0.1,
            duration: 0.1,
            ease: `power2.out`,
        });
    }
    VCombatantAnimations.hurt = hurt;
    async function die(unit) {
        console.log(`${unit.name} is dying`);
        unit.thought = " ";
        const tweeener = new TemporaryTweeener(unit);
        const filter = new AdjustmentFilter();
        unit.sprite.filters = [filter];
        tweeener.to(filter, { brightness: 0.2, saturation: 0.1, duration: 1 });
        const direction = unit.sprite.scale.x < 0 ? 1 : -1;
        await tweeener.to(unit, { pixi: { alpha: 0.8, pivotX: direction * 150 } });
        await tweeener.to(unit.statusIndicators, { alpha: 0.0 });
    }
    VCombatantAnimations.die = die;
    async function noCard(unit) {
        await blinkThought(unit, "?");
    }
    VCombatantAnimations.noCard = noCard;
    async function skipAction(unit, text) {
        await blinkThought(unit, text);
    }
    VCombatantAnimations.skipAction = skipAction;
    async function spawnFloatyText(unit, value, color) {
        const fx = new Text(value, {
            fill: [0xd0e0f0, color],
            fontFamily: "Impact, fantasy",
            fontSize: 40 + (20 * 2) / value.length,
            fontWeight: `bold`,
            stroke: 0x102030,
            strokeThickness: 10,
            align: "center",
        });
        fx.anchor.set(0.5, 0.5);
        unit.addChild(fx);
        const tweeener = new TemporaryTweeener(fx);
        await tweeener.to(fx, {
            pixi: { y: fx.y - 40, alpha: 0.0 },
            duration: 1.5,
            ease: `power1.in`,
        });
        fx.destroy();
    }
    VCombatantAnimations.spawnFloatyText = spawnFloatyText;
})(VCombatantAnimations || (VCombatantAnimations = {}));
//# sourceMappingURL=VCombatant.animations.js.map