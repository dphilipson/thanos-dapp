/** @jsx jsx **/
import { memo, ReactElement } from "react";
import { Box, BoxProps, jsx } from "theme-ui";

const Container = memo(function Container(props: BoxProps): ReactElement {
  return (
    <Box
      {...props}
      sx={{
        width: "100%",
        maxWidth: [null, "540px", "720px", "960px", "1140px", "1320px"],
        paddingRight: ".75rem",
        paddingLeft: ".75rem",
        marginRight: "auto",
        marginLeft: "auto",
      }}
    />
  );
});
export default Container;
