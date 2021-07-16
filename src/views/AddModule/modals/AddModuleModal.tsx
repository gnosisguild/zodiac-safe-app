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
  tags: string[];
  readMoreLink?: string;

  onAdd(): void;

  onClose?(): void;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute !important" as "absolute",
    paddingBottom: theme.spacing(2),
    overflow: "auto",
    alignItems: "flex-start",
  },
  backdrop: {
    position: "absolute !important" as "absolute",
    backdropFilter: "blur(4px)",
  },
  root: {
    width: "100%",
    maxWidth: 380,
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

export const AddModuleModal: React.FC<AddModuleModalProps> = ({
  open,
  title,
  description,
  image,
  onAdd,
  tags,
  readMoreLink,
  onClose,
  children,
}) => {
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
        className: classes.backdrop,
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

        {children ? (
          <div className={classes.gutterBottom}>{children}</div>
        ) : null}

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
