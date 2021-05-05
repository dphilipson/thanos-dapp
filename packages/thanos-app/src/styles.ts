import { keyframes } from "@emotion/react";
import { ThemeUIStyleObject } from "@theme-ui/css";

export const buttonSx: ThemeUIStyleObject = {
  backgroundColor: "blue.3",
  boxShadow:
    "inset 0 0 0 1px rgb(16 22 26 / 40%), inset 0 -1px 0 rgb(16 22 26 / 20%);",
  cursor: "pointer",
  userSelect: "none",
  fontSize: 2,
  height: "40px",

  ":hover:not(:disabled)": {
    backgroundColor: "blue.2",

    ":active": {
      backgroundColor: "blue.1",
    },
  },

  ":disabled": {
    backgroundColor: "rgba(19,124,189,.5)",
    color: "disabled",
    cursor: "not-allowed",
  },
};

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
