import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";

const DEFAULT_DESCRIPTION = "The hardest choices require the strongest wills.";

export interface HtmlHeadProps {
  title: string;
  description?: string;
}

const HtmlHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
}: HtmlHeadProps): ReactElement => (
  <Helmet
    htmlAttributes={{ lang: "en" }}
    title={title}
    meta={[
      { name: "description", content: description },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site:id", content: "1389683026762764290" },
      { name: "twitter:creator:id", content: "1389683026762764290" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ]}
    link={[
      { href: "https://fonts.gstatic.com", rel: "preconnect" },
      {
        href: "https://fonts.googleapis.com/css2?family=Lato&display=swap",
        rel: "stylesheet",
      },
    ]}
  />
);
export default HtmlHead;
