/** @jsx jsx */
import { providers } from "ethers";
import {
  Fragment,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Flex, jsx, Text } from "theme-ui";
import { buttonSx, delayedFadeInSx } from "../styles";
import { USER_REJECTED } from "../util/constants";
import { EthNetwork, useMetamask } from "../util/metamask";
import { SnapState, ThanosClient } from "../util/thanos";

const SnapView = memo(function SnapView(): ReactElement {
  const metamask = useMetamask();
  const [snapState, setSnapState] = useState<SnapState>();
  const [isAwaitingSnapConfirm, setIsAwaitingSnapConfirm] = useState(false);
  const [userRejectedSnap, setUserRejectedSnap] = useState(false);
  const thanosRef = useRef<ThanosClient>();

  const syncSnapState = useCallback(
    () => thanosRef.current?.getSnapState()?.then(setSnapState),
    []
  );

  const snap = useCallback(async () => {
    const thanos = thanosRef.current;
    if (!thanos) {
      return;
    }
    setSnapState(SnapState.IN_PROGRESS);
    setUserRejectedSnap(false);
    setIsAwaitingSnapConfirm(true);
    try {
      await thanos.snap();
    } catch (error) {
      if (error.code === USER_REJECTED) {
        setSnapState(SnapState.NOT_STARTED);
        setUserRejectedSnap(true);
      } else {
        throw error;
      }
    } finally {
      setIsAwaitingSnapConfirm(false);
    }
  }, []);

  useEffect(() => {
    // Start the real action once the provider connects.
    if (metamask.network !== EthNetwork.KOVAN) {
      return;
    }
    const { connectedProvider } = metamask;
    if (connectedProvider && !thanosRef.current) {
      const signer = new providers.Web3Provider(connectedProvider).getSigner();
      thanosRef.current = new ThanosClient(signer);
      syncSnapState();
      thanosRef.current
        .waitForSnapResult()
        .then((isDusted) =>
          setSnapState(isDusted ? SnapState.DUSTED : SnapState.ALIVE)
        );
    }
  }, [metamask.connectedProvider]);

  function renderContent(): ReactElement | undefined {
    if (!metamask.isInstalled) {
      return <Text>Metamask is required.</Text>;
    }
    if (!metamask.isInitialized) {
      return undefined;
    }
    if (metamask.network !== EthNetwork.KOVAN) {
      return <Text>Please switch to Kovan.</Text>;
    }
    if (metamask.isConnecting) {
      return (
        <Button sx={buttonSx} disabled={true}>
          Connecting…
        </Button>
      );
    }
    if (!metamask.currentAccount) {
      return (
        <Fragment>
          <Button sx={buttonSx} onClick={metamask.connect}>
            Connect to Metamask
          </Button>
          {metamask.userRejected && (
            <Text mt="12px" sx={{ fontSize: 2 }} color="red.4">
              User rejected connection. Please try again.
            </Text>
          )}
        </Fragment>
      );
    }
    if (isAwaitingSnapConfirm) {
      return (
        <Button sx={buttonSx} disabled={true}>
          Snapping…
        </Button>
      );
    }
    switch (snapState) {
      case null:
      case undefined:
        return (
          <Text key="loading-snap" sx={delayedFadeInSx}>
            Loading snap state…
          </Text>
        );
      case SnapState.NOT_STARTED:
        return (
          <Fragment>
            <Button sx={buttonSx} onClick={snap}>
              Snap
            </Button>
            {userRejectedSnap && (
              <Text mt="12px" sx={{ fontSize: 2 }} color="red.4">
                User cancelled transaction.
              </Text>
            )}
          </Fragment>
        );
      case SnapState.IN_PROGRESS:
        return <Text>Waiting for result…</Text>;
      case SnapState.DUSTED:
        return (
          <Text key="dusted" sx={delayedFadeInSx}>
            You are dusted.
          </Text>
        );
      case SnapState.ALIVE:
        return <Text key="alive">You are alive!</Text>;
    }
  }

  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      {renderContent()}
    </Flex>
  );
});
export default SnapView;
