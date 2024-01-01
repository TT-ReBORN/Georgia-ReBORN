# Georgia-ReBORN changelog:
<br>

## Updated to Georgia v2.0.3 - 20 April 2023 - Commit 514 8db1e81
## Updated to Library v2.4.0
## Updated to Biography v1.4.2
<br>


## Update v3.0 - October ??, 2023
<br>


## Update v3.0-RC2 - September 24, 2023
### Added:
- Implemented special unique feature to use custom theme, styles, preset for every album via custom gr-tags usage
  * See in the FAQ under Customization section: "How can I set custom theme, styles, preset for music albums?"
- Implemented auto-write of theme tags to music files via Playlist/Library's context menu
- Added new theme sandbox mode via top menu Options > Settings > Theme sandbox
  * This mode is useful when trying out themes, styles, presets or writing theme tags.
    After disabling the theme sandbox mode, previously used theme settings can be restored.
- Implemented auto panel width feature, it is a new layout design.
  * Can be activated via top menu Options > Player controls > Panel > Width > Use auto panel width
  * This feature will auto adjust all widths of all panels when player size is not proportinal,
    e.g when manually resizing the width of the player, it is very nice for QHD/WQHD and other panorama monitor resolutions
    and not only that, it also looks cool for HD and 4K usage.
  * When using the auto panel width feature, be sure to choose between top menu
    Options > Player controls > Album art > When player size is not proportional.
    Align album art left or with margin is recommended.
- Implemented disc art album cover placeholder feature
  * You can activate this feature via top menu Options > Details > Disc art > Disc art placeholder > CD - Album cover/Vinyl - Album cover
    or via when right clicking on the big album art cover > Disc art placeholder > CD - Album cover/Vinyl - Album cover
  * It will load the current displayed album cover into the cd or vinyl placeholder.
  * Changed default theme settings to display the new disc art album cover placeholder feature when no disc art was found
- Implemented new playback order "Repeat playlist" mode
- Implemented Peak Loudness Ratio into the playlist, thx @RobyOne77 for the contribution =)
  * Can be activated via Options > Playlist > Album header > Show PLR value and Options > Playlist > Track row > Show PLR
  * The albums/tracks need to be scanned via replay gain and have its metadata stored
  * More information can be found here: https://github.com/TT-ReBORN/Georgia-ReBORN/pull/143
- Added support for multi-artist hyperlinks in the playlist header
- Added new lyrics options based on new lyrics code
  * Top menu Options > Lyrics > Display > Show drop shadow
  * Top menu Options > Lyrics > Display > Show fade scroll
  * Top menu Options > Lyrics > Scroll speed
- Added playback mode indicator as lower bar transport button tooltips
  * Displays "Stop after current", "Playback follows cursor" and "Cursor follows playback" when main tooltips are enabled
    via top menu Options > Player controls > Tooltip > Show main tooltips
- Added new right click context menus for top menu and lower bar with all available options
  * There are two different context menus when you right click in the lower bar:
    * When you right click somewhere not near the seekbar that will open the lower bar context menu
    * When you right click somewhere in the seekbar that will open the seekbar context menu
- Added option to hide the middle panel shadow
  * Can be found in top menu Options > Player controls > Panel > Hide middle panel shadow
- Added "Filter order" and "View order" options to top menu Options > Library
- Added undo action support ( CTRL + Z )
- Added mouse wheel cycling through album artworks in Library
- Added more codec logos for the metadata grid, thanks @风里尘 =)
- Added foo_cuefixer to the official Georgia-ReBORN user-components
- Added new ESLyric sources
  * Absolutelyrics
  * Bandcamp
  * Chartlyrics
  * Darklyrics
  * elyrics
  * Letras
  * Lyrical Nonsense (Japanese)
  * Lyrical Nonsense (English)
  * LyricsMania
  * LyricsMode
  * LyricsTranslate
  * NetEase (English)
  * Oldielyrics
  * Plyrics
  * Songlyrics
  * STlyrics

### Changed:
- Restored previous used async album art fetching
- Restored top menu Option > Player controls > Album art > Load embedded album art first
- Removed library auto thumbnail size setting from library full preset
  * You can manually change thumbnail size when using the library layout full preset
- Moved lyric options "Remember active lyrics state" and "Remember lyrics panel state"
  to Top menu Options > Lyrics > Controls
- Renamed "Show colored gap" feature to album art background
  * Options > Player controls > Album art > When player size is not proportional:
    'Left album art bg', 'Full album art bg', 'No album art bg'

### Improved:
#### Main:
- Rewritten lyrics code based on WilB's with improved changes - thx @Wil-B =)
- ESLyric's "Lyric search" popup now changes lyrics immediately when a different lyircs source has been selected
- Improved theme preset and custom theme tags performance by 100%
- Improved main UI black and white text color change on gradiented background when using gradient styles
- Improved behavior of the theme preset style indicator
- Improved album art background feature when player size is not proportional with additional full setting
  * Options > Player controls > Album art > When player size is not proportional > Full album art bg
- Big cleanup with improved code structure
  * Separated all functions ( Main, Playlist, Library and Biography ) from all callbacks and put them
    into a new file ( gr-main-functions.js )
    * Reordered and cleaned main functions ( Main, Details, Playlist, Library and Biography )
    * Reordered and cleaned gr-callbacks
    * Added missing descriptions
#### Playlist:
- Improved playlist smooth drag scroll when reordering items
- Improved playlist scroll performance when using the default auto-hide scrollbar feature
- Improved playlist row stripes colors
- Improved playlist drag line color according to themes
#### Library & Biography:
- Restored last library view mode from library split layout when not using the library full layout preset
- Refactored library and biography layout switcher
#### Lyrics:
- Improved Reborn theme lyrics text color in Biography and Lyrics panel when background is light/similar color
- Improved lyric search behavior, will display lyrics immediately on the first found search result
#### Misc:
- Improved theme backup that also now saves and restores foobar config and dsp settings
- Full code documentation

### Removed:
- Removed now obsolete option "Remember album art view" in Options > Library > Layout
  * Used when not using the library layout full preset, using album art view and switching
    between library normal to full layout. It now works without the need to activate that setting.
- Removed top menu Options > View > Layout > Default ( prevents user to break the Georgia-ReBORN layout in UI Columns )

### Fixed:
#### Fixed - Main:
- Fixed Reborn theme & Reborn fusion style colors when background is too light or too dark
- Fixed crash when album art image location does not exist ( i.e was moved to another location by user while it previously existed )
- Fixed crash when using theme backup & restore for old fb2k versions
- Fixed crash when applying the theme performance presets and saving to config
- Fixed crash when home panel is set to "Details" while switching from Compact to Default layout
- Fixed rare crash when topMenu was not properly initialized
- Fixed rare art cache crash on startup
- Fixed jump search when CTRL key is pressed ( should not be activated )
- Fixed seekbar issue on mouse wheel playback seeking
- Fixed peakmeter bar tooltip repaint issue
- Fixed crash when using playlist header collapse features and playlist group header is deactivated
- Fixed behavior of the theme preset style indicator
- Fixed clearing auto random preset timer when switching back to non-timed settings
- Fixed cosmetic logo issue on foobar startup/reload sometimes not updating to the active theme
- Fixed top menu compact anti-aliasing issue when using custom theme fonts
- Fixed theme backup restore when using after fresh foobar installation
- Fixed an issue when migrate check updates to the latest version
- Fixed correct description of lower bar display settings and values for custom themes,
  add missing reborn fusion styles description in the georgia-reborn-config.jsonc
#### Fixed - Details:
- Fixed heavy performance issue
- Fixed release country flag size and position on multi-lines
- Fixed label crash when using full background and deactivating disc art
- Fixed incorrect timeline playcount population & tooltip issue
- Fixed metadata grid text color switch on some bg colors when using alternative styles
- Fixed metadata grid text color switch on some bg colors when using alternative styles
- Fixed DTS codec logo display issue in the metadata grid
#### Fixed - Playlist:
- Fixed playlist crash when updating selection and no items exist
- Fixed playlist crash when drag and drop files and no playlist exists
- Fixed playlist crash when queueing playlist items and it is not properly initialized
- Fixed playlist history crash when it is not properly initialized
- Fixed playlist hyperlink crashes
- Fixed playlist hyperlink label issue
- Fixed playlist manager text being hidden when no genre exist
- Fixed playlist manager text button display issues when auto-hide is deactivated
- Fixed playlist manager bg flashing when bg color changes
- Fixed playlist scrollbar dragging issue in split layout when clicking outside the playlist
- Fixed playlist bottom drag scroll when playlist headers are collapsed
- Fixed missing side marker color for Cream theme when using playlist collapsed headers
#### Fixed - Library:
- Fixed library unnecessary album art/tree initialization
- Fixed library album art/tree view issue when not using the library full preset
- Fixed library split presets where not properly updated
- Fixed library selection color when using custom themes and different album art label types
- Fixed library filter options "nowplaying" and "selected"
- Fixed rare library crash when initializing album art root image thumbnail
- Fixed other issues when using the library split layout
#### Fixed - Biography:
- Fixed biography lyrics and nowplaying init issues
- Fixed some position issues with overlay layout
#### Fixed - Lyrics:
- Fixed artwork and disc opacity issues when lyrics layout is in full width while displaying lyrics
- Fixed Lyric search and Next lyric features to work now properly - thx @ESLyric =)

### Updated:
- Updated foo_playcount component to v3.1.5
- Updated foo_uie_eslyric component to v0.5.4.1011
<br>


## First public release v3.0-RC1 - June 08, 2023
### Added:
#### Added - Main:
- Added the ability to create your own custom theme via top menu Options > Theme > Custom > Edit custom theme
  * First select a custom theme slot you want to edit, all 10 custom themes have a predefined custom theme.
  * When a custom theme slot is selected, you can use the context menu > right click > Edit custom theme for quick navigation.
  * You can either select the color via the color picker or paste a HEX value in the input field.
  * It will apply all changes in real time and saves it automatically in the georgia-reborn-custom.jsonc config file.
    Each color has a name that you can also find in the georgia-reborn-custom.jsonc config file and modify it there.
  * To reset the colors to the default ones, select the "Reset" option from the drop down menu.
  * Tip: Download the resource pack from the Github page to open the custom theme template and modify colors in Photoshop or Gimp.
    If you are happy with the result, just copy and paste the HEX values.
  * You can showcase your custom themes and share your configs here:
    https://github.com/TT-ReBORN/Georgia-ReBORN/discussions/86
- Added 10 high quality custom themes, you can visit the official custom theme showcase thread here:
  https://github.com/TT-ReBORN/Georgia-ReBORN/discussions/99
  * This is not only a presentation for the new custom themes but should also serve as an inspiration for yours!
  * Once you have downloaded posted custom configs, copy it to your config directory: foobar2000\profile\georgia-reborn\configs.
  * Start or reload foobar and select the new custom themes via top menu Options > Theme > Custom.
  * If you plan to share and upload your custom themes, read the notes in the custom theme thread first!
- Added a feature to indicate all theme colors as a helper for custom theme editing
  * In the custom theme menu, a new lightbulb icon button has been added for all theme colors
  * If you click on the lightbulb, it will mark and show you which color is used in the theme
  * Some colors need to be displayed to be shown, i.e:
    - Playlist/library/biography row stripes ( show row stripes )
    - Auto-hide scrollbars ( deactivate auto-hide )
    - Auto-hide playlist manager ( deactivate auto-hide )
- Added and implemented the ability to save currently used theme colors to custom themes
  via top menu Options > Theme > Custom > Save current colors
  * This feature works like a color snapshot. For example, if you are using Reborn/Random or any other themes
    and there are current colors you like, you can save them to a custom theme. It is recommended to save
    your georgia-reborn-custom.jsonc config file located in your foobar2000\profile\georgia-reborn\configs
- Added 3 new Reborn theme special styles in top menu Options > Style
  * Reborn fusion, a secondary album art picked primary color used in top and lower bar background
  * Reborn fusion 2, same as Reborn fusion but reversed
  * Reborn fusion accent, secondary album art picked primary color used as accent color
- Added a total of 88 different theme presets in top menu Options > Presets
  * 08 theme presets for White theme
  * 10 theme presets for Black theme
  * 30 theme presets for Reborn theme
  * 10 theme presets for Random theme
  * 05 theme presets for Blue, Dark blue, Red theme
  * 05 theme presets for Cream theme
  * 10 theme presets for Neon themes
  * 10 theme presets for Custom themes
  * You also have the ability to create and save your own preset in the config file ( georgia-reborn-config.jsonc )
    and activate the custom preset in top menu Options > Preset > Custom > User settings.
- Added style auto random preset picker in top menu Options > Preset > Auto random.
  * Default selected option is double click, that means you can double click for example on the lower bar
    and it will randomly auto pick and use a new theme preset. You can select a timer or deactivate it.
  * There is also the option to filter out presets in Options > Preset > Select presets.
    When you deactivate certain theme presets, e.g all Neon themes, it will exclude those and not use them in the random picking process.
- Added and implemented a cool new feature in top menu Options > Preset > Select mode > Harmonic
  * The harmonic preset select mode will automatically choose the best visual experience of themes and styles
    on the current playing album cover:
    * When the album art is very bright ( mostly light or white colors ), it will choose a random White theme preset.
    * When the album art has mostly colors from the middle spectrum, it will choose a random Reborn theme preset.
    * When the album art has mostly colors from the middle spectrum and primary and secondary chosen color has a wide
      color distance ( large distinction between those two ), it will choose one of the three Reborn fusion presets.
    * When the album art is very dark ( mostly dark or black colors ), it will choose a random Black preset or Neon theme preset.
  * You can also double-click on the lower bar to choose another random harmonic preset.
  * When harmonic preset select mode is activated, all themes and almost all style options will be disabled.
  * You can also filter out certain presets, for example if you don't like the Neon theme presets for dark album art,
    go to top menu Options > Presets > Use presets and deactivate the Neon theme presets.
 - Added and implemented a cool new feature in top menu Options > Preset > Select mode > Theme
   * The theme preset select mode will automatically choose a random theme preset based on current active theme.
     You can also double-click on the lower bar to choose another random theme preset.
     When theme preset select mode is activated, all themes and style options will be available.
- Added theme preset indicator in top menu Options > Preset > Indicator
  * This will inform the user when current active styles matches any theme presets
    Useful when experimenting with styles using different combos to know if a preset already exist
  * Will show selected theme preset when double clicking on lower bar
- Added 4 new progress bar styles -> Lines, Blocks, Dots, Thin
  * Can be accessed via new lower bar right click context menu -> Style
  * Can be accessed via top menu Options > Style > Progress bar > Design
- Added and implemented peakmeter bar, modified and based off kgena_ua's original scripts
  * To be able to monitor and measure the stereo audio channels and work properly,
    it needs the foo_vis_vumeter component which is included in the zip.
  * It contains 3 different styles, right click on lower bar and select Peakmeter.
    Right click again for peakmeter bar context menu settings and select Style.
  * You can experiment with various Display settings, for example select Style "Vertical"
    and disable all display setting except Peaks, you will get a playing piano :-)
  * You don't really need a progress bar, mouse drag and drop and click for skipping through track still works.
  * If you have a good PC, I recommend to set refresh rate to 60 ms ( right click lower bar > Refresh rate ).
- Added and implemented @regorxxx's "Not-A-Waveform-Seekbar" script into Georgia-ReBORN
  * You can change the seekbar via right click context menu on the lower bar
  * After the progress bar has been changed to waveform bar, right click again for waveform bar settings.
  * All waveform bar settings are also in the top menu Options > Player controls > Seekbar > Waveform bar
  * For more information visit https://github.com/regorxxx/Not-A-Waveform-Seekbar-SMP
  * Added @regorxxx to the Georgia-ReBORN hall of fame family section in the readme =)
- Added right click lower bar context menu
  * Includes progress bar, peakmeter bar and waveform bar settings
  * Every active seekbar contains its own context menu when right clicking
- Added progress bar refresh rate settings in top menu Options > Player controls > Seekbar > Progress bar > Refresh rate
  * Also available in the right click lower bar context menu while progress bar is active
- Added styled tooltips in top menu Options > Player controls > Tooltip > Show styled tooltips
  * Fancy styled tooltips that will dynamically change and adjust to the current theme color
- Added new configurable notification font size in top menu Options > Font size > Main > Notification
  * Popup font size controls font size of notification elements such as jump search and style indicator
- Added new configurable popup font size in top menu Options > Font size > Main > Popup
  * Popup font size controls font size of popup elements such as custom theme popup and theme log overlay
- Added new configurable tooltip font size in top menu Options > Font size > Main > Tooltip
  * Popup font size controls font size of styled tooltips
- Added new feature to change the layout in Default mode for all panels ( Playlist, Library, Biography, Lyrics ) except Details to full width
  * This was previously only possible in the Library with album art grid enabled, Biography looks pretty nice with right click > Layout > Left.
  * You can access this feature by simply right clicking in the panels for context menu > 'Change layout to full width'
    and if clicking again 'Change layout to normal width'.
  * In all panels ( not for Details but also for Lyrics ) the width can be independently configured.
- Added and using default Library and Biography presets ( this is useful when using the new full width feature, enabled by default )
  * Can be deactivated in top menu Options > Library/Biography > Layout > Use full preset
- Added new theme day/night mode in top menu Options > Settings > Theme day/night mode
  * This mode will only work for White, Black, Reborn and Random theme, all other themes plus special styles will not be supported.
  * If you want to use this mode, you need to activate it first by choosing a time schedule, for example "8am (day) - 8pm (night)".
  * When this mode is active, it will change theme colors to white ( day ) or black ( night ) based on OS clock and day/night mode setting.
    For example, it will automatically change to Black theme after 8pm evening and change to White theme after 8am in the morning.
    On startup or theme reload it will automatically adjust the theme, every 10 minutes ( because of considering performance will not achieve accurate timing )
    a timer will check the OS clock when it's playing or when it's stopped.
  * Reborn and Random theme will only change color to black or white on startup, when it's playing music, both themes will chose album art or random color.
- Added all available theme settings into the config file ( georgia-reborn-config.jsonc ).
  * You can now set all theme settings via top menu Options.
    If you use top menu Options > Settings > Theme configuration > Save settings to config file, all your settings will be automatically written to the georgia-reborn-config.jsonc file located in your foobar2000\profile\georgia-reborn\configs folder.
  * You can use top menu Options > Settings > Theme configuration > Load default settings and it will NOT overwrite settings in the config file.
    To change back to your config settings, use top menu Options > Settings > Theme configuration > Load settings from config file.
  * Almost all settings can now by modified and set in the config file, if you make a new installation, just overwrite your existing config file
    and restart foobar. Now the theme loads and uses the config settings again.
  * Only some settings in the config file must be manually set and will NOT be saved
    when using top menu Options > Settings > Theme configuration > Save settings to config file. These settings are extra noted in the section header.
  * If something goes wrong, backup your config file and use top menu Options > Settings > Theme configuration > Reset all.
    This will reset all settings and also those in your config file. Or just delete the config file and reload the theme.
    A new config file will be created on the next reload/foobar start.
- Added theme performance presets in top menu Options > Settings > Theme performance
  * These presets will change various theme settings! It is recommended to save current theme settings to the config file.
    You should also make a backup of your playlists to be on the safe side!
  * "High quality" and especially "Highest Quality" can freeze foobar, depending how fast your CPU performs.
    It does not matter if you are using a multi-core CPU, only single-core CPU performance counts!
    If your foobar is unresponsive, restart and change to a lighter preset.
- Added new custom theme fonts support in top menu Options > Settings > Theme fonts
  * All fonts used in the theme can be now replaced with own custom fonts
  * First activate use custom theme fonts, this will automatically reload the theme and use the Open Sans font as placeholder.
    It will also open the georgia-reborn-config.jsonc file, at the bottom of the config file you can change all fonts.
    Be sure to name your custom fonts with the exact font name/family and restart foobar.
    If everything was set correctly, in top menu Help > Theme > status > All fonts installed should be checked.
    If not, check foobar's console, it will show font errors with its wrong font names
- Added theme cache options in top menu Options > Settings > Theme cache
  * Library cache options:
    Enable the disk cache for best performance. It contains resized images that facilitate faster loading and is built as images are initially loaded.
    Optimum performance will be achieved when the cache is fully built. If new images are obtained or images replaced,
    the cache copy can be refreshed from the refresh context menu item.
    Optionally cached images can be preloaded in the background. Preloading completes shortly after initialization.
    After that images should always show immediately on scrolling, subject to memory available.
  * Auto-delete and manual delete cache with cache location for Library, Biography and Lyrics
  * When auto-delete is activated, it will always clear the cache on startup. Useful if you don't want to have growing cache folders.
- Added the ability to use your own custom library directory
  * Open your georgia-reborn-custom.jsonc file at go to the "customLibraryDir" section:
    Replace the path below and activate in top menu Options > Settings > Theme cache > Library > Use custom library directory.
- Added the ability to use your own custom biography directory
  * Open your georgia-reborn-custom.jsonc file at go to the "customBiographyDir" section:
    Replace the path below and activate in top menu Options > Settings > Theme cache > Biography > Use custom biography directory.
- Added the ability to use your own custom lyrics directory
  * Change in foobar's Preferences > ESLyric > Lyric options > Location to your custom lyric folder.
    Open your georgia-reborn-custom.jsonc file at go to the "customLyricsDir" section.
    Replace the path below and activate in top menu Options > Settings > Theme cache > Lyrics > Use custom lyrics directory.
- Added album art scale options in When player size is maximized/fullscreen via top menu Options > Player controls > Album art
  * When player goes into maximized or fullscreen state, the album art ( depending on the desktop resolution )
    could be minimal cut off on the left side. With the option "Scale album art proportional" the full artwork will be displayed.
- Added option to show or hide software version in lower bar in top menu Options > Player controls > Lower bar
- Added option to display Hi-Res Audio badge if playing music is higher than 16 Bit or 1411 kbps in top menu
  Options > Player controls > Album art > Show hi-res audio badge on album cover
- Added option to load embedded album art first in top menu Options > Player controls > Album art > Load embedded album art first
- Added option to lock the player size in top menu Options > Player controls > Panel > Lock player size
- Added option to choose which panel should start in top menu Options > Player controls > Panel > Show panel on startup
- Added option to return to home on playback stop in top menu Options > Player controls > Panel > Return to home on playback stop
  * This is and was the default behavior, it means it will return to playlist ( home ) when clicking on the stop button.
    If this option is deactivated, it will stay on the current active panel.
- Added option top menu in top menu Options > Player controls > Top menu
  * You can deactivate each Details, Library, Biography, Lyrics and Rating panel
  * Additional top menu left alignment, center is and was default ( if player size >= Normal )
- Added additional option for Artwork and Compact layout for:
  * Options > Player controls > Lower bar > Show composer in lower bar
  * Options > Player controls > Lower bar > Show artist country flags in lower bar
  * Options > Player controls > Lower bar > Show software version in lower bar
- Added additional option for Artwork layout for:
  * Options > Details > Metadata grid > Show artist
  * Options > Details > Metadata grid > Show song title
  * Options > Details > Metadata grid > Show timeline
  * Options > Details > Metadata grid > Show artist country flags
  * Options > Details > Metadata grid > Show release country flags
- Added quick navigation for Playlist, Details, Library and Lyrics options in panels context menus
  * Right click in Playlist for context menu > first option
  * Right click in Details for context menu > first option
  * Right click in Library for context menu > first option
  * Right click in Lyrics for context menu > first option
  * Note: Biography has the same options as the context menu, there is no need for that
- Added option to show or hide volume bar tooltip in top menu Options > Player controls > Tooltip > Show volume tooltips
- Added option to show percentage for volume tooltip in top menu Options > Player controls > Tooltip > Show volume tooltips
- Added disc art placeholder top menu options into album art context menu for quick navigation
- Added new option Mouse wheel seek speed in top menu Options > Player controls > Seekbar > Progress bar
  * If you mouse hover the progress bar and mouse wheel down/up, the current track will forward/skip back in seconds ( default is 5 seconds ).
- Added make theme backup feature in top menu Options > Settings > Theme backup > Make backup
  * This will automatically make a backup of your configs, library ( playcounts/statistics ) and playlists.
  * The backup will be created in your foobar2000\profile\backup ( portable fb2k )
    or in C:\Users\YourUsername\AppData\Roaming\foobar2000\backup ( standard fb2k ).
  * On a new foobar2000 installation:
    Using portable -> just copy/paste and replace the profile
    Using standard -> just copy/paste and replace the content of the profile
    and go to top menu Options > Settings > Theme configuration > Load settings from config file.
 - Added restore theme backup feature in top menu Options > Settings > Theme backup > Restore backup
  * This will automatically restore your theme backup of your configs, library ( playcounts/statistics ) and playlists.
    Restoring backups works only if a backup exist.
  * WARNING: Changes and modifications since your last backup (new theme settings, new playlists and play statistics) will be lost!
    It is recommended to make a new backup before you restore.
#### Added - Playlist:
- Added Playlist "Auto collapse and expand" in top menu Options > Playlist > Album header
- Added Playlist "Show" and "Auto-hide when no cover" options in top menu Options > Playlist > Album header > Album art
- Added Playlist "Show disc sub-header" and "Show group info" options in top menu Options > Playlist > Album header
- Added Playlist "Show bit depth and sample rate" in top menu Options > Playlist > Album header
- Added option to customize the playlist header info via top menu Options > Playlist > Album header > Customize header info
  * You can directly put your pattern now in the input popup box, this will directly update your config file.
- Added option to customize the playlist track row via top menu Options > Playlist > Track row > Customize track row
  * Enter your desired custom pattern for:
    1. When playlist header is being displayed ( default )
    2. When playlist header is deactivated ( Options > Playlist > Album header > Album header )
- Added playlist auto sort option in top menu Options > Playlist > Sort order > Always auto-sort
  * If you want to use this feature, activate it and then select your preferred sort order.
  * The auto playlist sort order will be always applied when adding new albums from the Library
    to the Playlist or when you manually adding albums from your Explorer to the Playlist.
  * If you have a very large active playlist ( 30.000+ songs ) and have a slow CPU, it will take
    a hit on your performance. That means you will have to wait until the whole playlist
    with all songs are re-initialized!
- Added Mordred's playlist history feature
  * Up to 10 playlist history states are stored when changing through playlists
  * Playlist history back and forward buttons are in the playlist manager header when available
  * Also shown as playlist context menu items "Previous playlist state" and "Next playlist state" when available
- Added to show/disable playlist history button in playlist manager via top menu Options > Playlist > Playlist manager > Show playlist history
- Added now playing indicator in the "Search" playlist when using playlist hyperlinks
- Added support for %album artist% for playlist hyperlinks
- Added option to show or hide track numbers in the Playlist in top menu Options > Playlist > Track row > Show track numbers
- Added option to show or hide index numbers in the Playlist in top menu Options > Playlist > Track row > Show index numbers
- Added option to use rating from tags in top menu Options > Playlist > Track row > Show rating from tags
- Added option to show rating grid in top menu Options > Playlist > Track row > Show rating grid
- Added SMP playlist lock, can be accessed via playlist tools context menu or playlist right click context menu.
  * Old components like foo_utils are no longer needed and should be removed. If you have playlists locked with foo_utils,
    first unlock them all via deactivating top menu Edit > Read-only, then you can use normally the SMP playlist lock feature.
#### Added - Details:
- Added option to control album art transparency in Details in top menu Options > Details > Album art
  * If you have selected the right theme or theme preset, the spinning disc art can look pretty cool with the right opacity setting.
    When the theme has dark/black colors, it is the best to use dark/black disc art and when the theme has bright/white colors,
    it is the best to use bright/white disc art.
  * If the disc art is spinning while this option is on and you have a slow CPU it will lag and freeze foobar depending on player size,
    for example going into fullscreen mode.
    Performance also depends on spinning disc art redraw speed in top menu Options > Details > Disc art > Spinning disc art redraw speed
- Added disc art display amount in top menu Options > Details > Disc art > Disc art display amount
  * This option controls how much disc art will be shown from the sleeve.
  * If there is enough width space and using auto, the disc will go automatically out depending on the player width size,
    otherwise it will stay at the minimum right margin space ( progress bar ).
  * Default setting is now 50%, same behavior like auto but it will always stay with the album cover centered.
- Added the ability to directly change Details metadata grid tags in top menu Options > Details > Metadata grid > Edit metadata grid
  * Or via right click context menu > Details options menu > Edit metadata grid
  * Thanks also goes to @regorxxx ( https://github.com/regorxxx )
- Added %originaldate% tag to %edition% so it will also display it in Details.
- Added option to display now playing playlist in metadata grid in Details
  via top menu Options > Details > Metadata grid > Show playing playlist
- Added option to show or hide the timeline in Details in top menu Options > Details > Metadata grid > Show timeline
- Added codec logos for metadata grid in Details in top menu Options > Details > Metadata grid > Show codec logo
  - Contains support for following codecs and formats:
    aac, ac3, aiff, dts, alac, ape, dsd, dxd, dst, flac, mp3, mpc, ogg, opus, pcm, sacd, w64, wav, wavpack
- Added and using new default entry "Source" in the metadata grid in Details with following pattern:
  * For lossless codecs will show bit depth, sample rate ( only if higher than 44.1khz ), optional %media type% ( CD, Vinyl, WEB etc. ) and bitrate
  * For lossy codecs will show additional codec profile if exists, optional %media type% ( CD, Vinyl, WEB etc. ) and bitrate
- Added and using new default entry "File Size" in the metadata grid in Details
  * Will show the file size of the current playing track
- Added additional display options for Details release country flags in top menu Options > Details > Metadata grid > Show release country flags
#### Added - Library:
- Added split layout for Library in top menu Options > Library > Layout > Split
  * Quick access via right clicking on the Library panel > Change layout to split
  * Right clicking on the Library panel again > Change layout to full or Change layout to normal
- Added Playlist/Library split preset (collapse) in top menu Options > Library > Layout > Use split preset (collapse)
  * If activated, it will use the auto-collapse headers feature when using the new Library split layout
    and displaying both Playlist and Library ( Library panel active ).
    When changing back to Playlist, it will auto-expand all playlist headers.
- Added Playlist/Library split preset (text) in top menu Options > Library > Layout > Use split preset (text)
  * If activated, it will hide playlist headers when using the new Library split layout
    and displaying both Playlist and Library ( Library panel active ).
    When changing back to Playlist, it will show all playlist headers again.
- Added Playlist/Library split preset (art grid) in top menu Options > Library > Layout > Use split preset (art grid)
  * Same as Use split preset (collapse) preset, but it will also change Library to album art grid layout
- Added Playlist/Library split preset (art header) in top menu Options > Library > Layout > Use split preset (art header)
  * Same as Use split preset (collapse) preset, but it will also change Library to album art header layout
- Added Library play modes in top menu Options > Control > Action mode
  * Browser:
   - Keeps playing playlist
   - Easy to browse track lists, e.g. in album art or facet modes
   - Works best with playback follows cursor OFF & playlist ( Library split layout ) visible
   - Double-click status bar etc to view playing playlist
  * Player:
   - Plays from playback queue
   - Doesn't involve a playlist
   - Optional display of queue & now playing indicators
   - Max queue size: 256 (foobar2000 limit)
- Added middle mouse click options in top menu Options > Library > Control
- Added Alt + mouse click options in top menu Options > Library > Control
- Added various Library statistics options in top menu Options > Library > Track row > Statistics
- Added Library thumbnail size "Playlist" in top menu Options > Library > Album art > Thumbnail size > Playlist
  * Synchronizes Library thumbnail size with Playlist thumbnail size when changing the Playlist font sizes,
    mostly used for the new Library/Playlist split layout
- Added library themes in top menu Options > Library > Theme
- Added additional default Library view patterns
- Added option to show or hide track duration in the Library in top menu Options > Library > Track row > Show track duration
- Added option to show or hide scrollbar index and type for album art in the Library in top menu Options > Library > Album art > Index
- Added sort order options for Playlist and Library in top menu Options > Playlist/Library and in Library hamburger menu
- Added additional library album art thumbnail sizes 'XL', 'XXL', 'MAX' in top menu Options > Library > Album art > Thumbnail size
- Added album art thumbnail options in top menu Options > Library > Album art > Thumbnail border
- Added library album art year overlay and changed Options > Library > Album art > Track count > Show overlay to Options > Library > Album art > Overlay
- Added option to play only albums/songs in the Library for double click action via top menu Options > Library > Track row > Double-click action > Play only
#### Added - Biography:
- Added additional Biography layout "Full overlay" in top menu Options > Biography > Layout > Full overlay
- Added Biography option to show/hide summary in top menu Options > Biography > Display > Summary
- Added Biography option to expand/collapse summary in top menu Options > Biography > Display > Summary expand/collapse
- Added Biography's focusLoadRate refresh rates to theme performance presets.
- Added Biography auto-cycle options in top menu Options > Biography > Image > Auto-cycle
- Added Biography image downloads in top menu Options > Biography > Image > Downloads
  * This will set the number of image downloads for one artist when displaying the Biography.
    Higher number will increase the size of the Biography cache folder.
#### Added - Lyrics:
- Added option to make current synced lyric larger in top menu Options > Lyrics > Display > Larger current sync
- Added option to remember active lyrics state in top menu Options > Lyrics > Display
- Added various lyrics options in top menu Options > Lyrics and also in the lyrics context menu
- Added support for embedded offset in lyric lrc files
#### Added - Various:
- Added F11 shortcut for going into/out fullscreen mode ( disabled/not supported in Artwork layout, ESC also exits fullscreen mode )
- Added Mordred's more precise color distance calculation
- Added Mordred's sharper album art interpolation mode ( maximum artwork sharpness )
- Added output device menu in top menu Options > Settings > Output device
- Added fancy and useful theme debug overlay in top menu Options > Developer tools > Enable theme debug overlay
- Added Developer "Show ram usage" in top menu Options > Developer tools
- Added console in top menu Options > Developer tools ( top menu 'View' does not exist in Artwork/Compact layout )
- Added foo_scrobble as a default user-component to Georgia-ReBORN

### Changed:
- Cleaned and reorganized SMP Panel Properties
- Cleaned and reorganized options menus
- Foobar's top menu 'Library' button renamed to 'Media' ( better than having two Library buttons and less confusing )
- Deactivated track count overlay in album art as default and moved it to top menu Options > Library > Album art > Track count
- Activated 'Filter cd/disc/vinyl .jpgs from artwork' as default in top menu Options > Details > Disc art
- Renamed lyrics option Remember lyrics setting after restart to Remember lyrics panel state
- Renamed top menu Options > Player controls > Progressbar to Seekbar
- Lyric colors are no longer in the SMP Panel Properties, you can change them in gr-themes.js
  * Main = col.lyricsHighlight, col.lyricsNormal, col.lyricsShadow, Biography = uiBio.col.lyricsHighlight, uiBio.col.lyricsNormal
- Reorganized top menu Option settings
  * Better sorted and separated for better overview
  * Auto-scroll to current playing song for Playlist and Library is now in Options > Player controls > Scrollbar settings > Playlist/Library
  * Full line clickable in Library is now renamed to Row fully clickable
  * Create/Restore backup and Reset all settings are now in Options > Settings > Theme configuration
- Reorganized tooltips
  * All tooltips can be now found in top menu Options > Player controls > Tooltip settings
- Reorganized all script files and cleaned up file structure
  * georgia-reborn-theme.js renamed to gr-async-loader.js and moved to foobar2000\profile\georgia-reborn\js
  * georgia-reborn-main.js was split into gr-setup.js ( variables ), gr-main.js ( main user interface ), gr-menu.js ( top menu Options )
    and gr-callbacks.js ( all main funcs )
  * All theme configs are now located in foobar2000\profile\georgia-reborn\configs
    - Custom library, biography, lyrics directory, custom fonts and custom style preset
      are now located and written in the new georgia-reborn-custom.jsonc config file.
  * All theme images are now located in foobar2000\profile\georgia-reborn\images
  * All theme text files ( CHANGELOG.md, README.md, TODO.md ) are now located in foobar2000\profile\georgia-reborn\docs
- Disabled disc art options for Artwork layout, as disc art only exist for Default layout
- Changed default theme from White theme to Reborn theme

### Fixed:
#### Fixed - Main:
- Windows 7 Georgia-ReBORN fonts issues, also cleaned up some fonts because they were a mess...
- Weird tooltip behavior in Details ( Metadata grid )
- Playback order button, reload button, volume button being not hidden when it was deactivated for one particular layout
- Default full width layout behavior when changing from top menu Options
- Disabled/grayed menu state in Wine/Linux - thx @ghuDaYuYu =)
- Theme loading background color when using certain styles
- Automatically black and white color change of band and label logo
- Label background color
- Band and label logo will not be displayed when no album art is loaded
- Playback option "Playback follows cursor" and "Cursor follows playback" will automatically jump to the current playing song in the Playlist
- Locked auto hide volume bar drag state when muting and dropping on volume button
- Loading album art when using some unconventional file managing
- Theme init issues on playback new track when a context menu is being active/open
- Fixed scaling popup issues, thx @Wil-B =)
- Various small cosmetic fixes
#### Fixed - Playlist:
- Title color draw issue while using the Reborn/Random theme when Playlist title color changed from black to white and vice versa
- Smooth scroll jump bug when removing songs
- Applied workaround for drag and drop Wine/Linux bug - you need to downgrade and use Spider Monkey Panel v1.5.2
- Drag n drop bug when dragging/reordering songs downwards
- Album art "Show" and "Auto" options in Playlist context menu > Appearance
- Resize update when album headers are deactivated
- Displaying the track number on currently playing song with tooltip in the playlist rows
- Crash in Compact layout when using the jump search and result was found in the Library
- Very old crash that occurred when playlist scroll scrolled to a non-existing position
- Playlist metrics when changing from a higher to lower font size ( had wrong sizes )
- Context menu crashes when no playlist index exist
- A very old playlist crash bug when changing playlist font size and rows height was not properly initialized.
- Fixed a very old cosmetic playlist flashing in header and row now playing background
  * Was sometimes visible when using the White or Black theme with a slow CPU since SMP v1.6.0
- Fixed cosmetic now playing indicator width change when using scrollbar auto-hide and scrollbar does not exist
- Fixed/Enhanced playlist label hyperlinks ( works now with %publisher% tag )
#### Fixed - Library:
- Rare track init issues on startup in the library - thx @Wil-B =)
- Cosmetic mouse move cursor caret/arrow bug on library search box
- Library mouse hover when changing from library tree to album art from top menu Options
- Update Library's nowPlaying when playing a song from the Playlist
- A very old cosmetic library flashing in row now playing background
- Various color issues when using labels overlay dark mode
#### Fixed - Biography:
- Filmstrip thumbnails not always loading images, thx @Wil-B =)
- Tooltips ( were in conflict with lowerBar tooltips )
- Image seeker show on/off
- Font bugs on Linux in Wine
- Mode Image only was not centered when using two different image formats ( circular and regular ) on artist and album cover
- Fixed cosmetic disc art placeholder issues ( flickering and some cut edges due to compression ) being very visible in 4K resolution.
- When using animation with transparent round objects it is recommended NOT to use any compression at all or it will become dirty.
#### Fixed - Library:
- Display of synced lyrics with multi-timestamps for enhanced lrc extension

### Improved:
#### Improved - Theme core:
- Massive code refactoring and cleanup
  * Modernized code in all scripts
  * Replaced and removed all lodash dependencies -> lodash free theme
  * Better code documentation and easier navigation
    * If you use VS Code, I highly recommend to install the 'Better Comments' extension, you can customize tag colors!
    * For example use my config, looks pretty cool for dark themes. Paste it in your settings.json: https://pastebin.com/rE3myie7
- Further improved overall performance
  * When starting a new song ( ~ 40-50% faster ) and also when using dynamic color themes ( White, Black, Reborn, Random - initialization is ~ 2,5x faster )
  * When using style Blend/Blend2
  * When no album art cover is being found and using the no album art stub ( due to slow resizing/scaling method )
  * When using the Playlist auto-scrolling ( Options > Playlist > Always scroll to current playing song )
- New improved config file design
  * Formatted with better organized structure and description.
- New improved Georgia-ReBORN color system
  * Refactored and cleaned up gr-themes.js
  * Better colors when using various styles
  * Better color detection when using style blend
- Extended SMP ram usage to 4 GB ( maximum for foobar 32bit )
- Extended SMP slow script warning to 60 sec ( maximum )
- Cleaned console logging -> show Enhanced Playcount logging only in debug log
#### Improved - Main:
- JumpSearch now works properly with Playlist content and is independent of indexed Media Library items,
  also added more search patterns ( %artist%, %album artist%, %composer% )
  * Default behavior for the jumpSearch is as follows:
  * If you use jumpSearch in all panels but Library, it will try to find results in the Playlist. If nothing was found, it will search in the Library.
  * If you use jumpSearch in the Library, it will try to find results in the Library. If nothing was found, it will search in the Playlist.
  * You can type just one letter and if a band exists with the typed letter, it will jump to first letter ( you can use this method for quick navigation ).
  * You can type more letters or the full name for better, more precise search results.
  * You can disable the default behavior so it will only search in the Playlist or only in the Library in top menu
    Options > Player controls > Jumpsearch settings > and deactivate 'Include library in jumpSearch playlist query'
    and 'Include playlist in jumpSearch library query'.
- JumpSearch adjusted and designed to each individual theme
- All font sizes can now be changed and configured for each layout ( Default, Artwork, Compact )
  * That means you can change all font sizes with different sizes for Default layout and different sizes for Artwork layout and Compact layout.
  * If you switch layouts, the font sizes you've previously set and changed in top menu Options > Font size for the current layout are still used and saved.
- Implemented mouse middle button ( wheel ) actions for Library and Biography.
  * If mouse is in the Library or Biography panel, dragging foobar around with holding
    the mouse middle button ( wheel ) will be disabled to execute Library and Biography
    mouse middle button actions. If mouse is anywhere outside of the Library or Biography panel,
    window drag will resume.
- Adjusted colors when using the Reborn theme with almost white album art covers or primary color
- Adjusted colors when using the Reborn theme with almost pure black primary color
- Various theme improvements
#### Improved - Playlist:
- Added selection indicator when playlist header is collapsed
- Auto-collapse playlist headers when using drag and drop (e.g reordering items) with auto-collapse feature
#### Improved - Details:
- New redesigned and improved Details timeline
  * Cleaner overall design ( looks like a headline now which integrates better with the metadata grid )
  * Harmonic proportions - 2/3 height of the progressbar with margin on both sides for continuous vertical flow
  * Better color palettes for various themes
#### Improved - Library:
- You can now also playback queue your tracks in the Library, right click for context menu > Add to playback queue
  * To show the playback queue in the Library change statistics view to Playback queue via Options > Library > Track row > Statistics
    or clicking on the Library hamburger menu ( right beside Filter ) > Statistics or right click in Library > Library options > Track row > Statistics
  * If you set a playback queue either from the Library or from Playlist, playback queue will be automatically displayed in both panels.
#### Improved - Biography:
- Filmstrip positioning in Biography now also supported outside the image ( when not overlayed )
- Some small Biography layout improvements
- Compact mode now also supports country flags
- Better design in Artwork layout when manually scaling player size and album art is not proportional
- Improved when loading album art and image is corrupt, trying to load embedded album art if available
- Improved volume bar width size when using Artwork or Compact layout with various transport button settings and a small player size
- Automated search query when using "Get disc art" from the album art context menu
- Improved "Display next artwork" and "Display previous artwork" in album art context menu
#### Improved - Lyrics:
- Some visual lyric improvements when not using album art as background

### Removed:
- Removed deprecated old backup and restore method in top menu Options > Settings > Theme configuration > Create/restore backup
  * Use the new method described above
- Removed reload configuration from top menu Options > Settings > Theme configuration
  * This was the same function as "Load settings from config file"
- Removed Invert band/label logos to black from top menu Options > Details
  * No more need for this, it will automatically do that for you
- Removed option "Show playlist on startup" from Options > Playlist
  * This option is replaced by option "Show panel on startup" in Options > Player controls > Panel
- Replaced Lyric Show 3 and MultiSource component with ESLyric component
  * You need to replace all files from the zip file, if that's not enough a new portable installation is needed.
  * Lyric Show 3 component did not work on Linux/Wine, ESLyric is working and is fast
  * Lyric Show 3 component is very old and is not being updated while ESLyric is actively maintained and updated.

### Updated:
- Updated Library to v2.4.0 - thx @Wil-B =)
  * library-tree-cache is now located in foobar2000\profile\library
- Updated Biography to v1.4.1 - thx @Wil-B =)
  * Biography directory yttm changed to biography in foobar2000\profile\biography
- Updated foo_columns_ui component to v2.0.0 - thx @reupen =)
- Updated foo_enhanced_playcount component to v5.0.0 - thx @Mordred =)
- Updated foo_musicbrainz component to v0.5.0 - thx @Mordred =)
- Updated foo_spider_monkey_panel to the la(te)st unofficial build by @marc2k3 - thx =)
- Updated foo_uie_eslyric component to v0.5.3.1031 - thx ohyeah =)
<br>


## Update v2.0.3b - April 17, 2022
#### Theme:
- Added new theme "Random" -> Options > Theme > Random
- Random theme will generate random colors that are NOT based on album art
- Random theme has an auto color timer feature that can be set in Options > Style > Auto color
- Double clicking on lower bar in Random theme will generate a new color
- Reborn theme ( also Random theme ) has now dynamically adjusted shadow opacity<br>
  ( previously panel shadows were nearly invisible on darker colors )
- Reborn theme will adjust colors when cycling through images

#### Styles:
- Added various styles -> Options > Style ( different styles for each individual theme ):
- Bevel
- Blend, Blend 2
- Gradient, Gradient 2
- Alternative, Alternative 2
- Black and white, Black and white 2, Black and white reborn
- Black reborn
- Reborn white, Reborn black
- Random pastel, Random dark, Auto color
- Styles also available for top menu buttons, transport buttons, progress and volume bar:
- Filled, Bevel, Emboss, Inner, Minimal
- Progress bar and volume bar have an additional Rounded style

#### QHD:
- Added QHD mode -> Options > Display
- Added 9 predefined player sizes for QHD
- Added automatic QHD detection
- Added pre-optimized/adjusted font sizes for QHD

#### Various:
- Added adjustable brightness -> Options > Brightness
- Added Create/Restore backup and theme reset -> Options > Settings > Theme settings
- Added more font sizes for scaling
- Added missing mouse hover animation for library and biography scrollbar thumb
- Added new Playlist tools menu
- Added shortcut Alt + Left click automatically adds tracks from Library to Playlist
- Added option to show artist name in playlist if it's not the same as album artist -> Options > Playlist > Show artist name on difference
- Added option to fallback to last.fm scrobbles if no local play count exist -> Options > Playlist > Show last.fm scrobbles on no local plays
- Added option to disable album art when displaying lyrics -> Options > Lyrics > Show album art when displaying lyrics
- Added jump search also for Playlist. Jump search can be activated in all panels and if not first activated in the Library,<br>
  it will show results first in the Playlist and if no results were found then it will try in the Library.
- Increased up to 6 country flags
- Optimized and reordered some top menu options items
- Top menu minimize, fullscreen, close button scaling
- Corrected overlapping of artist & album title in playlist
- Fixed library nowPlaying when using option "Always scroll to current playing song" and synced with Playlist
- Fixed library arrow keys navigation
- Fixed progress bar fill color when playing from a CD
- Fixed cosmetic font bump when changing other layout transport button sizes while current active layout is different
- Removed Deezer source from lyric search ( caused instability )
- Reactivated clipboard funcs in library and biography for Wine/Linux users ( no more right click crashes ) thx @marc2k3 =)
- Various bug fixes and fine tuning

#### Performance:
- Huge code rewrites/refactoring and cleanup -> it's basically a new theme =)
- Much faster overall performance
- Faster loading times
- Active playlist with a ridiculously huge amount of tracks no longer a performance killer when resizing the player<br>
  ( Only on foobar startup/theme reload and when you add to playlist, obviously you need to fully init the playlist content )
- Updated to @marc2k3's modified Spider Monkey Panel v1.6.2-dev+7c0928bf<br>
  ( Included marc2k3's utils.GetClipboardText/utils.SetClipboardText )

#### Components:
- Updated foo_multisource to v0.56
- Included Mordred's foo_musicbrainz user-component ( is now the standard tagging tool )
<br>


## 4. Update - Oct 25, 2021
- Added 11 Georgia-ReBORN logos
- Added full dynamic color theme "Reborn" ( Options > Theme )
- Added new final layout "Artwork" ( Options > Layout )
- Added 13 disc art placeholders ( Options > Details > Disc art > Disc art placeholder )
- Added radio lyrics support, placeholder when no album cover exist, lyrics can be now always displayed
- Added option Show track count in album art ( Options > Library )
- Added option to show playlist manager also in Artwork and Compact mode<br>
  ( Options > Playlist > Playlist manager > Show playlist manager )
- Fixed library's copy paste context menu in search
- Fixed library's occasional last nodes draw bug
- Fixed updating biography scroll buttons when changing themes
- Fixed updating Show tracks when expanding nodes
- Fixed crash when clearing SMP properties when no album cover displayed
- Fixed biography crash when switching to similar artist or album history
- Fixed biography allmusic photo fetching ( now works on Linux )
- Fixed some small bugs
- Better overall color change, also when colors are too dark in theme Black
- Better vertical top menu font positioning when using larger font sizes
- All 3 layouts ( Default, Artwork, Compact ) are independently configurable
- Various tweaks and fine tuning
- Updated Readme on Github
- Updated FAQ on Github
<br>


## 3. Update - Sep 26, 2021
#### Updated to Wil-B's latest Library v2.2.0:
- Heavily modified Library to fit theme design -> Georgia-ReBORN edition
- 8 designs plus exclusive custom made Georgia-ReBORN design (default)
- Improved Georgia-ReBORN's tree design
- Added Mordred's awesome dynamic color changer in all library designs for White and Black theme
- Added Now playing visual indicator, library has the same design logic as playlist
- Added dynamic thumbnail resizing based on player size
- Added full width option for album art mode, flow mode is always in full width
- Custom view pattern support
- Many new options

#### Updated to Wil-B's latest Biography v1.2.0:
- Heavily modified Biography to fit theme design -> Georgia-ReBORN edition
- New filmstrip feature
- Many new biography options added into top menu
- Developer tools hidden by default, can be enabled in Options -> Settings
- Added Option "Show pause on album cover" in player controls
- Added contiguous Ctrl+Shift playlist selection
- Added FAQ and updated the Github page
<br>


## 2. Update - Aug 26, 2021
- Code cleanup in all scripts and lots of rewrites ( much better overall performance on Windows and Linux )
- Playlist smooth scrolling performance is now 100% faster
- Removed all unnecessary stuff that is not needed in Georgia-ReBORN
- Added maximize function ( double click top menu )
- Added Option Show transport controls
- Added Option Show reload button
- Added Option Show Progress bar
- Added Option Show artist and song title in lower bar
- Added Option Show playback time
- Added Option Switch to playlist when adding songs for library
- Added Option to separately show artist country flags in lower bar or Details
- Added playback functions in context menu when transport control buttons are disabled
- Added support for cdART and vinylART to have folder "Artwork", "Images", "Scans" in root folder OR subfolder
- All available options are now independently customizable for Default and Compact mode
- Available width for artist and song title in Default mode will adjust when using different transport button sizes and spacing
- Better Details design for albums without cover or when radio streaming
- Bug fixes and lots of other improvements
- Updated Spider Monkey Panel to v1.5.2
- Updated foo_multisource to v0.55
<br>


## 1. Update - May 23, 2021
- Updated to Georgia 2.0.3 release
<br>

---

<br>

### Published on Github - May 20, 2021

### Georgia-ReBORN's birthday - May 16, 2019

<br>

---

<br>

# Georgia changelog:

### v2.0.0 - 2021-03-??
Rolls up all changes from the betas below plus
- Transport control settings added to config file
- Fixed display issues with Playlist >> Group Presets manager
- Now caching artist logos
- Improved readability/contrast of text in playlist/library when light/bright artwork is displayed

### v2.0.0b4 - 2021-02-21
- Lyrics filename patterns can be specified in the config file
- Config file can be edited/reset from the settings menu
- Artwork is no longer reloaded/parsed unnecessarily when changing tracks quickly (prevents flashes of wrong theme color)
- Added new icon set (and menu option to select) based on icons created by @Zephyr0ck

### v2.0.0b3 - 2021-01-30
- Now works with foo_ui_hacks to show min/max/close buttons when applicable and moves UI elements accordingly
- Fixed regression with Queue'd items not showing in playlist
- Transport button spacing now configurable (thanks @notsigma)
- Allow filtering out of cd.jpgs from showing with rest of artwork
- Improved config version upgrades
- Added option for showing full date in playlist header
- Lots of code cleanup

### v2.0.0b2 - 2021-01-15
- Updating config files from previous versions more robust
- Adding some new properties/settings
- Showing release country flag if the tf.releaseCountry field is set
- Replicated theme background on theme startup so on_paint never shows white
- Stopped text now shows "foobar" and version. This is configurable and you can set it back to "foobar plays music" which was the old default

### v2.0.0b1 - 2021-01-06
- foo_jscript_panel replaced with foo_spider_monkey_panel
- Simplified script initialization (no more pasting contents of Georgia.txt into Configuration panel after initial setup time)
- Automatically generating and reading preferences from georgia-config.jsonc
- When using hyperlinks to search, if current playing song is in results, it will show as playing
- Added georgia-config.jsonc file to store preferences outside foobar
- Updating track information in when `on_playback_dynamic_info_track` is called.
- Improve visibility of progress bar when art primary color is too dark (i.e. close to the background color)
- Theme update checks happen once a day if enabled

### v1.1.9 - 2020-07-10
- Fix library panel not showing tracks with foo_jscript_panel 2.4.x
- Allow specifying a custom discArt filename
- No longer show "0000" for date
- Allow override of playlist row_h
- Fix issues related to font-sizes in playlist header
- Prevent labels in playlist header from being drawn over group info
- Handle hyperlinks searching for albums with editions listed

### v1.1.8 - 2020-05-09
- Random now actually randomizes playlist
- Fixed volume control issues
- Improved tooltip handling for buttons
- Fixed issues with expanded volume bar disappearing and it's appearance in 4K mode
- Fixed crash when deleting last playlist
- CD Rotation values were bogus
- Refactored all menus using new `Menu` helper class, which cut menu code length in half and made adding new options much easier
- Fixed crash when using weblinks
- Playlist row and header fonts are scalable through Options >> Playlist settings
- Option to move transport controls below artwork
- Visual improvements in 4K mode (ensuring spacing between elements is scaled correctly)
- Adding Georgia entries to "Help" menu to quickly debug if the theme is installed correctly
- Added tooltips on hovering over timeline
- Adjust menu font sizes through options menu
- Adjust transport button sizes through options menu

### v1.1.7 - 2020-04-11
- Invert logos when theme primary color is dark (requires foo_jscript_panel v2.3.6)
- Fixed crash when clicking the hyperlink to upgrade. Sorry!
- Fixed crash when managing grouping presets
- Added volume control
- Album labels in playlist are now hyperlinks
- Fixed some date timezone issues
- Improved playlist look when tags don't have a genre

### v1.1.6 - 2019-11-13
- Fixed startup crashes when creating buttons
- Drag & Drop issues
- Simplified date and timezone handling
- Cleaned up georgia.txt
- Improved support for foo_youtube

### v1.1.5 - 2019-10-22
- Fixes for foo_jscript_panel 2.3.x
- Removed unneeded files
- Updating fonts

### v1.1.4 - 2019-08-29
- Add check for updates

### v1.1.3 - 2019-08-28
- Fixed broken dates
- Fixed anti-aliasing on elapsed time when playlist is shown

### v1.1.2 - 2019-08-27
- Playlist should always draw correctly now
- Dates should never show as "0000"
- Year now uses $if3(%original release date%,%originaldate%,%date%)
- ArtCaching was using the wrong values to scale. Corrected
- Ticks on the timeline should never show overlap the album art

### v1.1.1 - 2019-08-11
- Crash on startup when display playlist on startup set

### v1.1.0 - 2019-08-10
- Dark mode (new default)! Switch between the two in the options menu
- A ton more 4K fixes
- reiniting playlist when 4K mode switches to avoid scrollbar issues
- accurate date difference code based on human accepted norms of what a date difference is (i.e. 1 month ago)
- correctly handling forbidden characters when attempting to find artwork/files
- better sorting of results when clicking on hyperlinks
- searching dates by year only
- Fixed a bunch of issues with Multi-channel display
- Highlight colors in library/playlist should still allow text to be legible
- Drastically reduced console spam

### v1.0.1 - 2019-01-23
- Fix some 4K scaling issues
- auto load library 10s after startup for better response time
- fix crash in jscript 2.2.0+
- variable font sizing for artist string

### v1.0.0 - First official release
