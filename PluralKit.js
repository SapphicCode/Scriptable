// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: user-friends;
let textColor = Color.white()

async function getSystemData(systemID) {
  let systemURL = "https://api.pluralkit.me/v1/s/" + systemID
  let frontersURL = systemURL + "/fronters"

  let system = {}

  // fetching metadata
  try {
    system.meta = await new Request(systemURL).loadJSON()
  } catch {
    return null
  }

  // fetching fronters
  // this may fail due to privacy reasons, no logged switches, etc
  try {
    let fronters = await new Request(frontersURL).loadJSON()
    system.fronters = fronters.members
  } catch {
    system.fronters = []
  }

  return system
}

async function setWidget(widget, systemID) {
  let system = await getSystemData(args.widgetParameter)
  if (system == null) {
    widget.addText("PluralKit request failed, double-check the system ID")
    return
  }

  if (system.fronters.length == 0) {
    widget.backgroundImage = await new Request(
      system.meta.avatar_url
    ).loadImage()
    let name = widget.addText(system.meta.name)
    name.font = Font.lightSystemFont(14)
    name.textColor = textColor
    name.rightAlignText()
    name.shadowRadius = 1

    widget.addSpacer(null)
  } else {
    front = system.fronters[0]

    widget.backgroundImage = await new Request(
      front.avatar_url || system.meta.avatar_url
    ).loadImage()

    let name = widget.addText(front.name)
    name.font = Font.systemFont(16)
    name.textColor = textColor
    name.rightAlignText()
    name.shadowRadius = 1

    widget.addSpacer(null)

    let systemName = widget.addText(system.meta.name)
    systemName.font = Font.lightSystemFont(14)
    systemName.textColor = textColor
    systemName.rightAlignText()
    systemName.shadowRadius = 1
  }
}

if (config.runsInWidget) {
  let widget = new ListWidget()

  if (!args.widgetParameter) {
    widget.addText("Please add a system ID to check, as parameter")
  } else {
    await setWidget(widget, args.widgetParameter)
  }

  Script.setWidget(widget)
}
