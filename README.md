# RealJR_25736 Mods

Minecraft mod catalog at [RealJR_25736 Mods Website](https://realjr-mods.blinksmp.shop/#downloads).

## Posting a mod

Upload its JAR into `updates/`, then add an entry to the `mods` array in `mods.json`. Each entry uses `id`, `name`, `description`, `loader`, `minecraftVersion`, `version`, `downloadUrl`, `requirements`, and `autoPay`.

Set `autoPay` to `true` for any mod that automatically sends in-game money to RealJR_25736. The website shows the warning on its card and requires confirmation before downloading. Set it explicitly to `false` for mods without automatic payments. Missing values use the warning.

The existing JR Client entry reads its latest release from `api/updates.json`. Upload the release JAR before updating that manifest. Other mods can use a direct same-site JAR URL or their own `updateManifest` path.

The confirmation covers downloading through this website. Minecraft installation is performed by the player.
