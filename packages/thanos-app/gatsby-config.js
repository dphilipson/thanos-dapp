module.exports = {
  siteMetadata: {
    title: "thanos-app",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Thanos Dapp",
        short_name: "Thanos",
        start_url: "/",
        backgroundColor: "#293742",
        themeColor: "#293742",
        display: "minimal-ui",
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-theme-ui",
  ],
};
