# Georgia-ReBORN changelog:

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
 - Added various theme styles -> Options > Style ( different styles for each individual theme ):
 - Bevel
 - Blend, Blend 2
 - Gradient, Gradient 2
 - Alternative, Alternative 2
 - Black and white, Black and white 2, Black and white reborn
 - Black reborn
 - Reborn white, Reborn black
 - Random pastel, Random dark, Auto color
 - Theme styles also available for top menu buttons, transport buttons, progress and volume bar:
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
 - Added 13 disc art placeholders ( Options > Details > Disc art > Display disc art placeholder )
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
#### Updated to WilB's latest Library v2.2.0:
 - Heavily modified Library to fit theme design -> Georgia-ReBORN edition
 - 8 designs plus exclusive custom made Georgia-ReBORN design (default)
 - Improved Georgia-ReBORN's tree design
 - Added Mordred's awesome dynamic color changer in all library designs for White and Black theme
 - Added Now playing visual indicator, library has the same design logic as playlist
 - Added dynamic thumbnail resizing based on player size
 - Added full width option for album art mode, flow mode is always in full width
 - Custom view pattern support
 - Many new options

#### Updated to WilB's latest Biography v1.2.0:
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
 - Allow specifying a custom cdart filename
 - No longer show "0000" for date
 - Allow override of playlist row_h
 - Fix issues related to font-sizes in playlist header
 - Prevent labels in playlist header from being drawn over group info
 - Handle hyperlinks searching for albums with editions listed

### v1.1.8 - 2020-05-09
 - Random now actually randomizes playlist
 - Fixed volume control issues
 - Improved tooltip handling for buttons
 - Fixed issues with expanded volume bar disappearing and it's appearance in 4k mode
 - Fixed crash when deleting last playlist
 - CD Rotation values were bogus
 - Refactored all menus using new `Menu` helper class, which cut menu code length in half and made adding new options much easier
 - Fixed crash when using weblinks
 - Playlist row and header fonts are scalable through Options >> Playlist settings
 - Option to move transport controls below artwork
 - Visual improvements in 4k mode (ensuring spacing between elements is scaled correctly)
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
 - A ton more 4k fixes
 - reiniting playlist when 4k mode switches to avoid scrollbar issues
 - accurate date difference code based on human accepted norms of what a date difference is (i.e. 1 month ago)
 - correctly handling forbidden characters when attempting to find artwork/files
 - better sorting of results when clicking on hyperlinks
 - searching dates by year only
 - Fixed a bunch of issues with Multi-channel display
 - Highlight colors in library/playlist should still allow text to be legible
 - Drastically reduced console spam

### v1.0.1 - 2019-01-23
 - Fix some 4k scaling issues
 - auto load library 10s after startup for better response time
 - fix crash in jscript 2.2.0+
 - variable font sizing for artist string

### v1.0.0 - First official release