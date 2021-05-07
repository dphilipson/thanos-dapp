import { keyframes } from "@emotion/react";
import { ThemeUIStyleObject } from "@theme-ui/css";

/**
 * Fixes a bug in `keyframes` where the `toString()` method gets called while
 * unbound.
 */
const fixedKeyframes: typeof keyframes = (...args: any[]): any => {
  const result = keyframes(...args);
  result.toString = result.toString.bind(result);
  return result;
};

/**
 * Makes the component fade in after a second. Useful for loading text, to stop
 * it from flashing briefly if the load runs faster than expected.
 *
 * When using this, it may be a good idea to give the element a distinct key
 * prop if the element can be replaced by other elements which also have this
 * styling, as otherwise React may consider the replacement to be the same
 * component and not restart the animation.
 */
export const delayedFadeInSx: ThemeUIStyleObject = {
  animationDuration: "1s",
  animationTimingFunction: "ease-out",
  animationDelay: "1s",
  animationFillMode: "backwards",
  animationName: fixedKeyframes({ from: { opacity: 0 }, to: { opacity: 1 } }),
};
