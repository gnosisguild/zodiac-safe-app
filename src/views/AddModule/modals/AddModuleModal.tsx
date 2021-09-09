import React from "react";
import {
  ButtonProps as MuiButtonProps,
  Fade,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import { ActionButton } from "../../../components/ActionButton";
import { Icon } from "@gnosis.pm/safe-react-components";
import classNames from "classnames";
import { Link } from "../../../components/text/Link";
import { TagList } from "../../../components/list/TagList";
import { Row } from "../../../components/layout/Row";

interface AddModuleModalProps {
  open: boolean;
  title: string;
  description?: string;
  image: React.ReactElement;
  tags?: string[];
  readMoreLink?: string;
  ButtonProps?: MuiButtonProps;
  warning?: React.ReactNode;
  hideButton?: boolean;

  onAdd?(): void;

  onClose?(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    outline: "none",
    maxWidth: 380,
    margin: theme.spacing(14, 1, 1, 1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  modal: {
    position: "absolute !important" as "absolute",
    paddingBottom: theme.spacing(2),
    overflow: "auto",
    alignItems: "flex-start",
  },
  backdrop: {
    backdropFilter: "blur(4px)",
    animationName: "$blur",
    animationDuration: "500ms",
    animationTimingFunction: "ease",
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
    "& img": {
      width: "100%",
    },
  },
  infoContainer: {
    flexGrow: 1,
  },
  readMore: {
    display: "block",
    marginTop: theme.spacing(1.5),
  },
  loader: {
    display: "block",
    margin: "0 auto",
  },
  warningIcon: {
    marginRight: theme.spacing(1),
    "& .icon-color": {
      fill: "#E0B325 !important",
    },
  },
  warningText: {
    color: "#E0B325",
    lineHeight: 1,
  },
  "@keyframes blur": {
    "0%": {
      backdropFilter: "blur(0px)",
    },
    "100%": {
      backdropFilter: "blur(4px)",
    },
  },
}));

export const AddModuleModal: React.FC<AddModuleModalProps> = ({
  open,
  title,
  description,
  image,
  onAdd,
  tags = [],
  readMoreLink,
  onClose,
  children,
  ButtonProps,
  warning,
  hideButton = false,
}) => {
  const classes = useStyles();
  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      className={classNames(classes.modal, classes.row, classes.center)}
      BackdropProps={{
        className: classes.backdrop,
        invisible: true,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.root} elevation={3}>
          <div className={classNames(classes.row, classes.gutterBottom)}>
            <div className={classes.imageContainer}>{image}</div>
            <div className={classes.infoContainer}>
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>

              <TagList tags={tags} />

              {description ? (
                <Typography gutterBottom className={classes.description}>
                  {description}
                </Typography>
              ) : null}

              {warning ? (
                <Row>
                  <Icon
                    type="error"
                    size="md"
                    className={classes.warningIcon}
                  />
                  <Typography variant="body1" className={classes.warningText}>
                    {warning}
                  </Typography>
                </Row>
              ) : null}

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
            <div
              className={classNames({ [classes.gutterBottom]: !hideButton })}
            >
              {children}
            </div>
          ) : null}

          {hideButton ? null : (
            <ActionButton
              fullWidth
              startIcon={<Icon type="sent" size="md" color="primary" />}
              onClick={onAdd}
              {...ButtonProps}
            >
              Add Module
            </ActionButton>
          )}
        </Paper>
      </Fade>
    </Modal>
  );
};
