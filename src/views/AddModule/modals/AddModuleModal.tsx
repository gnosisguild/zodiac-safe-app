import React from "react";
import { makeStyles, Modal, Paper, Typography } from "@material-ui/core";
import { ActionButton } from "../../../components/ActionButton";
import { Icon } from "@gnosis.pm/safe-react-components";
import classNames from "classnames";
import { Link } from "../../../components/text/Link";
import { TagList } from "../../../components/list/TagList";

interface AddModuleModalProps {
  open: boolean;
  title: string;
  description: string;
  image: React.ReactElement;
  content?: React.ReactElement;
  tags: string[];
  readMoreLink?: string;

  onAdd(): void;

  onClose?(): void;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute !important" as "absolute",
    alignItems: "flex-start",
  },
  backdrop: {
    backdropFilter: "blur(4px)",
  },
  root: {
    width: "100%",
    maxWidth: 340,
    margin: theme.spacing(14, 1, 1, 1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  description: {
    marginTop: theme.spacing(1),
  },
  gutterBottom: {
    marginBottom: theme.spacing(3),
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  center: {
    justifyContent: "center",
  },
  imageContainer: {
    marginRight: theme.spacing(2),
  },
  infoContainer: {
    flexGrow: 1,
  },
  readMore: {
    display: "block",
    marginTop: theme.spacing(1.5),
  },
}));

export const AddModuleModal = ({
  open,
  title,
  description,
  image,
  onAdd,
  content,
  tags,
  readMoreLink,
  onClose,
}: AddModuleModalProps) => {
  const classes = useStyles();
  return (
    <Modal
      open={open}
      onClose={onClose}
      disablePortal
      disableAutoFocus
      disableEnforceFocus
      className={classNames(classes.modal, classes.row, classes.center)}
      BackdropProps={{
        className: classNames(classes.modal, classes.backdrop),
        invisible: true,
      }}
    >
      <Paper className={classes.root} elevation={3}>
        <div className={classNames(classes.row, classes.gutterBottom)}>
          <div className={classes.imageContainer}>{image}</div>
          <div className={classes.infoContainer}>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>

            <TagList tags={tags} />

            <Typography gutterBottom className={classes.description}>
              {description}
            </Typography>
            {readMoreLink ? (
              <Link
                href={readMoreLink}
                target="_blank"
                className={classes.readMore}
              >
                Read more here
              </Link>
            ) : null}
          </div>
        </div>

        {content ? <div className={classes.gutterBottom}>{content}</div> : null}

        <ActionButton
          fullWidth
          startIcon={<Icon type="sent" size="md" color="primary" />}
          onClick={onAdd}
        >
          Add Module
        </ActionButton>
      </Paper>
    </Modal>
  );
};
