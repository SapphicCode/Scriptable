// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: user-friends;
let textColor = Color.white()

async function getSystemData(systemID) {
  let systemURL = "https://api.pluralkit.me/v1/s/" + systemID
  let frontersURL = systemURL + "/fronters"

  let data = {
    meta: await new Request(systemURL).loadJSON(),
    fronters: (await new Request(frontersURL).loadJSON()).members,
  }
  return data
}

if (config.runsInWidget) {
  let w = new ListWidget()

  if (!args.widgetParameter) {
    w.addText("Please add a system ID to check, as parameter")
  } else {
    let system = await getSystemData(args.widgetParameter)

    if (system.fronters.length == 0) {
      w.backgroundImage = await new Request(system.meta.avatar_url).loadImage()
      let name = w.addText(system.meta.name)
      name.font = Font.lightSystemFont(14)
      name.textColor = textColor
      name.rightAlignText()
      name.shadowRadius = 1

      w.addSpacer(null)
    } else {
      front = system.fronters[0]

      w.backgroundImage = await new Request(
        front.avatar_url || system.meta.avatar_url
      ).loadImage()

      let name = w.addText(front.name)
      name.font = Font.systemFont(16)
      name.textColor = textColor
      name.rightAlignText()
      name.shadowRadius = 1

      w.addSpacer(null)

      let systemName = w.addText(system.meta.name)
      systemName.font = Font.lightSystemFont(14)
      systemName.textColor = textColor
      systemName.rightAlignText()
      systemName.shadowRadius = 1
    }
  }
  Script.setWidget(w)
}
