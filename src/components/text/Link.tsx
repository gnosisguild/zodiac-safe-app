import { withStyles, Link as MUILink } from "@material-ui/core";

export const Link = withStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    fontSize: 16,
    textDecoration: "underline",
  },
}))(MUILink);
