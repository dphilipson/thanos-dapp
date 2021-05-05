/** @jsx jsx */
import { memo, ReactElement, ReactNode } from "react";
import { jsx } from "theme-ui";
import HtmlHead from "../components/HtmlHead";
import { MetamaskProvider } from "../util/metamask";

export interface TrappingsProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const Trappings = memo(function Trappings({
  title,
  description,
  children,
}: TrappingsProps): ReactElement {
  return (
    <MetamaskProvider reloadOnAccountChanged={true}>
      <HtmlHead title={title} description={description} />
      {children}
    </MetamaskProvider>
  );
});
export default Trappings;
