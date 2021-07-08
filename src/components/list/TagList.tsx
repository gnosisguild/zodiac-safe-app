import React from "react";
import { makeStyles } from "@material-ui/core";

interface TagListProps {
  tags: string[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  tag: {
    display: "inline-block",
    borderRadius: 8,
    lineHeight: 1,
    padding: theme.spacing(0.75, 0.5),
    margin: theme.spacing(0, 1, 1, 0),
    backgroundColor: "rgba(0,20,40,0.5)",
    color: theme.palette.common.white,
  },
}));

export const TagList = ({ tags }: TagListProps) => {
  const classes = useStyles();
  return (
    <div>
      {tags.map((tag) => (
        <div key={tag} className={classes.tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};
