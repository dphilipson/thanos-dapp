/** @jsx jsx */
import { memo, ReactElement } from "react";
import { jsx, Text, TextProps } from "theme-ui";
import { useMetamask } from "../util/metamask";
import { capitalize } from "../util/strings";

const AccountText = memo(function AccountText(
  props: TextProps
): ReactElement | null {
  const { network, currentAccount } = useMetamask();

  if (!network) {
    return null;
  }
  return (
    <Text {...props} sx={{ color: "disabled", fontSize: 1 }}>
      {capitalize(network)}
      {currentAccount && `: ${currentAccount}`}
    </Text>
  );
});
export default AccountText;
