import { withStyles, Link as MUILink } from "@material-ui/core";

export const Link = withStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    textDecoration: "underline",
    transition: "opacity 0.25s ease-in-out",
    "&:hover": {
      opacity: 0.6,
    }
  },
}))(MUILink);
