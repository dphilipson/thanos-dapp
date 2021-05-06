module.exports = {
  siteMetadata: {
    title: "Thanos Dapp",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Thanos Dapp",
        short_name: "Thanos",
        start_url: "/",
        display: "minimal-ui",
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-theme-ui",
  ],
};
