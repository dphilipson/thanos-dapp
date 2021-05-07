/** @jsx jsx */
import { Link } from "gatsby";
import { memo, ReactElement } from "react";
import { Flex, jsx } from "theme-ui";
import Trappings from "../components/Trappings";

const NotFoundPage = memo(function NotFoundPage(): ReactElement {
  return (
    <Trappings title="Thanos Dapp - 404">
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        404 – Not Found
        <Link sx={{ mt: 3, fontSize: 2 }} to="/">
          Return to main page
        </Link>
      </Flex>
    </Trappings>
  );
});
export default NotFoundPage;
