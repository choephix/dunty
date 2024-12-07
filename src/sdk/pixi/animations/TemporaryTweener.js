import { gsap } from "gsap/gsap-core";
/**
 * Currently simply wraps GSAP's native functions for tweening object properties,
 * with the added benefit of destroying any queued up tweens when the object given
 * to the contructor ("sustainer") is destroyed.
 */
export class TemporaryTweeener {
    constructor(sustainer) {
        this.onDestroyFunctions = new Set();
        this.quickTo = (target, property, vars) => {
            const fn = gsap.quickTo(target, String(property), vars);
            return (value, start, startIsRelative) => {
                if (!target || target.destroyed)
                    return Promise.resolve();
                return this.registerForDestruction(fn(value, start, startIsRelative));
            };
        };
        this.to = (targets, vars) => {
            if (!targets || targets.destroyed)
                return Promise.resolve();
            return this.registerForDestruction(gsap.to(targets, vars));
        };
        this.from = (targets, vars) => {
            if (!targets || targets.destroyed)
                return Promise.resolve();
            return this.registerForDestruction(gsap.from(targets, vars));
        };
        this.fromTo = (targets, fromVars, toVars) => {
            if (!targets || targets.destroyed)
                return Promise.resolve();
            return this.registerForDestruction(gsap.fromTo(targets, fromVars, toVars));
        };
        this.createTimeline = (vars) => {
            return this.registerForDestruction(gsap.timeline(vars));
        };
        this.playTimeline = (fn, vars) => {
            const tl = this.createTimeline(vars);
            fn(tl);
            return tl.play();
        };
        this.delay = (seconds) => {
            return new Promise(resolve => gsap.delayedCall(seconds, resolve));
        };
        this.add = (fn) => {
            gsap.ticker.add(fn);
            const kill = () => gsap.ticker.remove(fn);
            this.onSustainerDestroyed(kill);
            return Object.assign(() => true, { kill });
        };
        this.remove = (fn) => {
            return gsap.ticker.remove(fn);
        };
        const cleanUp = () => {
            const fns = [...this.onDestroyFunctions];
            this.onDestroyFunctions.clear();
            fns.forEach(fn => fn());
        };
        sustainer.addListener("removed", cleanUp);
    }
    onSustainerDestroyed(fn) {
        this.onDestroyFunctions.add(fn);
    }
    onEveryFrame(cb) {
        gsap.ticker.add(cb);
        this.onDestroyFunctions.add(() => gsap.ticker.remove(cb));
    }
    registerForDestruction(tween) {
        this.onSustainerDestroyed(() => tween.kill());
        return tween;
    }
    killTweensOf(...args) {
        // @ts-ignore
        return gsap.killTweensOf(...args);
    }
}
//# sourceMappingURL=TemporaryTweener.js.map