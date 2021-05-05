/** @jsx jsx */

import { Flex, jsx } from "theme-ui";
import { memo, ReactElement } from "react";
import HtmlHead from "../components/HtmlHead";

const NotFoundPage = memo(function NotFoundPage(): ReactElement {
  return (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HtmlHead title="Thanos Dapp" />
      Not found.
    </Flex>
  );
});
export default NotFoundPage;
