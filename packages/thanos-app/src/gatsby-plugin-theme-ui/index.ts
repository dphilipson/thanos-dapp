import { Theme } from "theme-ui";

const theme: Theme = {
  colors: {
    text: "#F5F8FA",
    muted: "#A7B6C2",
    disabled: "rgba(167,182,194,.6)",
    link: "#48AFF0",
    background: "#293742",
    darkGray: ["", "#182026", "#202B33", "#293742", "#30404D", "#394B59"],
    gray: ["", "#5C7080", "#738694", "#8A9BA8", "#A7B6C2", "#BFCCD6"],
    lightGray: ["", "#CED9E0", "#D8E1E8", "#E1E8ED", "#EBF1F5", "#F5F8FA"],
    blue: ["", "#0E5A8A", "#106BA3", "#137CBD", "#2B95D6", "#48AFF0"],
    green: ["", "#0A6640", "#0D8050", "#0F9960", "#15B371", "#3DCC91"],
    orange: ["", "#A66321", "#BF7326", "#D9822B", "#F29D49", "#FFB366"],
    red: ["", "#A82A2A", "#C23030", "#DB3737", "#F55656", "#FF7373"],
  },
  fontSizes: [
    "0.875rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "1.875rem",
    "2.25rem",
    "3rem",
    "4rem",
    "4.5rem",
  ],
  space: [
    "0",
    "0.25rem",
    "0.5rem",
    "1rem",
    "2rem",
    "4rem",
    "8rem",
    "16rem",
    "32rem",
  ],
  breakpoints: ["576px", "768px", "992px", "1200px", "1400px"],
  styles: {
    root: {
      fontFamily: "'Lato', sans-serif",
      fontSize: 2,

      a: {
        color: "link",
        textDecoration: "none",

        ":hover": { textDecoration: "underline" },
      },

      button: {
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
      },
    },
  },
};
export default theme;
