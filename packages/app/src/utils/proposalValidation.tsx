export const handleProposalStatus = (
  type: "controller" | "owner" | "snapshot" | "safesnap",
  loading: boolean,
  isController: boolean,
  isOwner: boolean,
  hasSnapshot: boolean,
  validSnapshot: boolean,
  isSafesnapInstalled: boolean,
): "warning" | "error" | null => {
  if (!loading) {
    if (type === "snapshot" && !hasSnapshot) {
      return "error"
    }
    if (type === "snapshot" && !validSnapshot) {
      return "error"
    }
    if (type === "controller" && !isController) {
      return "error"
    }
    if (type === "safesnap" && isSafesnapInstalled) {
      return "error"
    }
    if (type === "owner" && !isOwner) {
      return "warning"
    }
  }
  return null
}

export const handleProposalStatusMessage = (
  type: "controller" | "owner" | "snapshot" | "safesnap",
  isController: boolean,
  isOwner: boolean,
  hasSnapshot: boolean,
  hasValidSnapshot: boolean,
  isSafesnapInstalled: boolean,
): string | null => {
  if (type === "snapshot" && !hasSnapshot) {
    return "The ENS name should have a Snapshot space created."
  }
  if (type === "snapshot" && !hasValidSnapshot) {
    return "Your snapshot settings file is invalid."
  }
  if (type === "controller" && !isController) {
    return "The safe must be the controller of the ENS name."
  }
  if (type === "owner" && !isOwner) {
    return "The safe is not the owner of the ENS name. We highly recommend transferring the ENS to this safe or enter a different ENS before continuing."
  }
  if (type === "safesnap" && isSafesnapInstalled) {
    return "The plugin is already installed on the Snapshot space."
  }
  return null
}
