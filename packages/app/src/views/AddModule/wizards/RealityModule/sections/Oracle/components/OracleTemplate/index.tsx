import { Grid, makeStyles, Typography, Tooltip } from "@material-ui/core"
import { Dropdown } from "components/Dropdown"
import React from "react"
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"
import { HelpOutline } from "@material-ui/icons"
import { InputPartProps } from "../.."

export const getDefaultTemplateQuestion = (ensName: string) =>
  `Did the Snapshot proposal with the id %s in the ${ensName} space pass the execution of the array of Module transactions that have the hash 0x%s and does it meet the requirements of the document referenced in the dao requirements record at ${ensName}?  The hash is the keccak of the concatenation of the individual EIP-712 hashes of the Module transactions. If this question was asked before the corresponding Snapshot proposal was resolved, it should ALWAYS be resolved to INVALID!`

const TEMPLATE_QUESTION_HELP = `Provide a question. This must include two %s placeholders.
The first placeholder is for the id of the proposal (e.g., an IPFS hash).
The second is the hash of the concatenation of the EIP-712 transaction hashes.`

const ORACLE_TEMPLATE_OPTIONS = [
  { label: "Zodiac Reality Module (default)", value: "default" },
  { label: "Custom", value: "custom" },
]

const ORACLE_LANGUAGE = [{ label: "English", value: "english" }]

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  textFieldSmall: {
    "& .MuiFormLabel-root": {
      fontSize: 12,
    },
  },
  select: {
    border: "1px solid rgba(217, 212, 173, 0.3)",
  },
  paperTemplateContainer: {
    marginTop: 4,
    padding: theme.spacing(1),
    background: "rgba(0, 0, 0, 0.2)",
  },
  templateQuestion: {
    fontFamily: "Roboto Mono",
    "& .MuiInputBase-root": {
      border: "none",
      fontSize: "0.85rem",
    },
  },
  input: {
    "& .MuiInputBase-root": {
      padding: "9px 8px",
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  button: {
    width: "100%",
    padding: "4px 15px",
  },
  buttonContainer: {
    marginTop: 8,
    cursor: "pointer",
  },
  icon: {
    color: colors.tan[1000],
    fontSize: "1rem",
    marginTop: 3,
  },
  text: {
    fontSize: "0.75rem",
  },
  tooltipIcon: {
    fontSize: "1rem",
  },
}))

export type Data = {
  templateType: "default" | "custom"
  language: "english"
  category: "DAO proposal"
  templateQuestion: string
}

interface OracleTemplateProps extends InputPartProps {
  ensName: string
}

export const OracleTemplate: React.FC<OracleTemplateProps> = ({
  data,
  setData,
  ensName,
}) => {
  const classes = useStyles()

  const set = (key: keyof Data) => (value: any) => setData({ ...data, [key]: value })

  const get = (key: keyof Data) => data[key]

  const setTemplateType = (templateType: "default" | "custom") => {
    if (templateType === "default") {
      setData({
        ...data,
        templateQuestion: getDefaultTemplateQuestion(ensName),
        templateType: templateType,
      })
    } else {
      setData({ ...data, templateQuestion: "", templateType: templateType })
    }
  }

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Oracle Template
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              The oracle template creates an appropriate question based on the data of the
              proposal. We highly recommend using the default Zodiac Reality Module
              template
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container justifyContent="space-between" spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Dropdown
              value={get("templateType")}
              options={ORACLE_TEMPLATE_OPTIONS}
              onChange={(evt) =>
                setTemplateType(evt.target.value as "default" | "custom")
              }
              label="Select template:"
              tooltipMsg="The Zodiac Reality Module type has defaults set for connecting the Reality Module to Safesnap. If you need a more specific setup, use the ‘Custom’ type."
            />
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              value={get("language")}
              options={ORACLE_LANGUAGE}
              disableUnderline={get("templateType") === "default"}
              label="Language:"
              disabled={get("templateType") === "default"}
              onChange={({ target }) => set("language")(target.value as string)}
            />
          </Grid>
          <>
            <Grid item xs={12}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography>Template question preview:</Typography>

                <Tooltip title={TEMPLATE_QUESTION_HELP}>
                  <HelpOutline className={classes.tooltipIcon} />
                </Tooltip>
              </Grid>

              <ZodiacPaper className={classes.paperTemplateContainer}>
                <ZodiacTextField
                  className={classes.templateQuestion}
                  value={get("templateQuestion")}
                  onChange={({ target }) =>
                    set("templateQuestion")(target.value as string)
                  }
                  multiline
                  rows={5}
                  disabled={get("templateType") === "default"}
                  placeholder={
                    get("templateType") === "default"
                      ? getDefaultTemplateQuestion(ensName)
                      : TEMPLATE_QUESTION_HELP
                  }
                />
              </ZodiacPaper>
            </Grid>
          </>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OracleTemplate
