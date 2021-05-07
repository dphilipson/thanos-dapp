/** @jsx jsx */
import { Link } from "gatsby";
import { memo, ReactElement } from "react";
import { jsx } from "theme-ui";
import Container from "../components/Container";
import Trappings from "../components/Trappings";
import { REAL_THANOS_ADDRESS } from "../util/constants";
import { capitalize } from "../util/strings";

const NotFoundPage = memo(function NotFoundPage(): ReactElement {
  function renderEtherscanLink(network: string): ReactElement {
    return (
      <a
        href={`https://${network}.etherscan.io/address/${REAL_THANOS_ADDRESS}`}
      >
        {capitalize(network)}
      </a>
    );
  }

  return (
    <Trappings title="Thanos Dapp - About">
      <Container mt={5}>
        <p>
          Snap your Ethereum account! Each account has a 50% chance of surviving
          and a 50% chance of being dusted.
        </p>
        <p>
          The randomness is provided by a{" "}
          <a href="https://docs.chain.link/docs/chainlink-vrf/">
            Verifiable Random Function from ChainLink
          </a>
          , so you can have confidence that your snap is conducted with the
          utmost fairness. This is also why this is not available on Mainnet,
          where requesting a single random value costs 2 LINK, or roughly $550
          at the time of writing!
        </p>
        <p>All snap results are permanent. Good luck!</p>
        <p sx={{ mt: 4 }}>
          GitHub:{" "}
          <a href="https://github.com/dphilipson/thanos-dapp">thanos-dapp</a>
          <br />
          Etherscan: {renderEtherscanLink("rinkeby")} /{" "}
          {renderEtherscanLink("kovan")}
        </p>
        <p>Contract address (all networks): {REAL_THANOS_ADDRESS}</p>
        <p sx={{ mt: 4 }}>
          <Link to="/">Return to app</Link>
        </p>
        <p sx={{ mt: 5 }}>Copyright © 2021 David Philipson</p>
      </Container>
    </Trappings>
  );
});
export default NotFoundPage;
