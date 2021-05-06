/** @jsx jsx */
import { memo, ReactElement } from "react";
import { Flex, jsx } from "theme-ui";
import AccountText from "../components/AccountText";
import SnapView from "../components/SnapView";
import Trappings from "../components/Trappings";

const IndexPage = memo(function IndexPage(): ReactElement {
  return (
    <Trappings title="Thanos Dapp">
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
        <SnapView />
      </Flex>
      <Flex mt={3} sx={{ position: "relative", justifyContent: "center" }}>
        <AccountText />
      </Flex>
    </Trappings>
  );
});
export default IndexPage;
