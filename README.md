<p align="center"><img src="https://i.ibb.co/xYSQXFT/logo-reborn.png" alt="Georgia-ReBORN logo"/></p>

# A Clean, Full Dynamic Color Reborn foobar2000 Theme

Georgia-ReBORN is a modification of **[Mordred's original Georgia theme](https://github.com/kbuffington/Georgia)** for foobar2000.<br />
It's purpose is to be used mainly as a desktop version, the layout has been modified to look clean and simple<br />
without any distractions. The cover artwork and playlist are the main focus. Besides the 10 existing themes<br />
Georgia-ReBORN has to offer ( Options > Theme ) there is one special theme "Reborn". Based on Mordred's<br />
awesome dynamic color change feature, this theme will completely change it's appearance based on album art,<br />
this means there are unlimited possibilities how the player will look like. Every new album you play will be<br />
a new experience!

![Themes](https://i.ibb.co/w6LqrzP/George-Re-BORN-Themes-Animation.webp)

WilB's awesome library and biography script has been integrated and modified to fit the overall design.<br />
You can choose the top menu > Options > Library to change various library options. Besides the 8 existing<br />
built-in designs, the library has it's own default Georgia-ReBORN design. The classical tree view can be changed<br />
swiftly by right clicking for the context menu and choose "Show album art". You can switch back to the default<br />
tree view by right click and choose "Tree view".

When album art is active, new options are now available in Options > Library > Album art.<br />
The layout feature is not available for "List view + album covers/artist photos" and "Flow mode".<br />
For convenience, when album art is active, you can easily change the layout by right clicking and choose:<br />
Change layout to full width or Change layout to normal width depending on the current state.<br />
Another cool feature is the dynamic thumbnail resizing, thumbnail size will change dynamically according<br />
to the foobar player size.

If you want to display artist photos in the library, you need to link your path to your biography directory.<br />
Go to File > Preferences > Display and under Album art click on the Artist tab. Here you need to set<br />
your full path, e.g: E:\PortableApps\foobar2000\profile\yttm\art_img\$cut(%artist%,1)\%artist%\*<br />
If you now fetch the images from the biography, it will automatically update your library with the photos.<br />
You can easily switch the view from albums to artists. If album art or flow mode is active, right click<br />
in the library > Show artists, to go back to default view open again the context menu and choose Show albums.

![Library](https://i.ibb.co/LxZ9mvT/George-Re-BORN-Library-Animation.webp)

In the biography you can change options via top menu Options > Biography or you can use the context menu.<br />
There are 4 different biography layouts to choose from, top is the default. There is also an automatic lyric fetcher<br />
using the Lyric Show 3 ( by The vern ) and Multisource component ( by veksha ). Synced lyrics will be highlighted<br />
with a theme color, unsynced lyrics have the default white text color.

![BiographyLyrics](https://i.ibb.co/HhN4PVV/George-Re-BORN-Biography-And-Lyrics-Animation.webp)

Georgia-ReBORN supports 4k resolutions and will adjust theme elements based on DPI and screen size.<br />
Fullscreen mode is also supported! There are 18 predefined sizes ( Options > Player size ), 9 for FULL HD<br />
and below and 9 for 4K resolution and higher. Each layout (Default, Artwork, Compact) has 3 different sizes.<br />
These predefined sizes are restricted, if you have a monitor that supports only a res of 1920 x 1200 and below,<br />
the first 9 are available. If you have a monitor capable of 4K resolution and higher, the other 9 are available.<br />
You can of course resize foobar to your liking, but it has minimum size restrictions to prevent button and<br />
text overlapping.

There are 3 different layouts to choose from ( Options > Layout ).<br />
You can resize the width and height but the player has a minimum size restriction:

![Sizes](https://i.ibb.co/P5W1Vxh/George-Re-BORN-Sizes-And-Layouts-Animation.webp)

**NOTE:** Georgia-ReBORN starts in player size 'Small' as a failsafe player size for small res. monitor/laptop screens<br />
and looks best if you switch to 'Normal' or a larger player size!

## Image Packs

These image packs are optional, they contain record labels and artist logos which will be displayed in 'Details'.
**[Download Record Labels](https://github.com/kbuffington/georgia-image-packs/raw/master/recordlabel.zip)** plus
**[Download Artist Logos Part 1](https://github.com/kbuffington/georgia-image-packs/raw/master/artistlogos.zip)** and
**[Download Artist Logos Part 2](https://github.com/kbuffington/georgia-image-packs/raw/master/artistlogos.z01)**.
Extract them to your foobar2000/profile/images

![Details](https://i.ibb.co/56bGbxp/George-Re-BORN-Details-Animation.webp)

**NOTE:** You need to download the disc art from https://fanart.tv. If you don't have any disc art, you can choose<br />
between 13 self created placeholders: Options > Details > Disc art > Display disc art placeholder<br />
For more information, please see the FAQ.

## Features

<b>✓</b> Georgia-ReBORN design

<b>✓</b> 11 different themes

<b>✓</b> Special theme 'Reborn' will fully automatically change colors based on album art

<b>✓</b> 18 predefined player sizes, 9 for Full HD and 9 for 4K

<b>✓</b> Default, Artwork and Compact mode

<b>✓</b> All layout modes fully configurable

<b>✓</b> 13 awesome disc art placeholders

<b>✓</b> Biography

<b>✓</b> Automatic 4k detection

<b>✓</b> Automatic lyric downloader

<b>✓</b> Automatic scrollbar hide for playlist, library and biography

<b>✓</b> A more modern library design that matches Georgia-ReBORN

## Installation Instructions

<b>1.</b> Install foobar2000 as portable from the **[Official Website](https://www.foobar2000.org/download)**.

<b>2.</b> Download the Georgia-ReBORN theme from this **[Github Page](https://github.com/TT-ReBORN/Georgia-ReBORN/archive/master.zip)**.

<b>3.</b> Extract the profile folder from the zip into foobar's root folder.

<b>4.</b> Install all located fonts from your foobar2000\profile\georgia-reborn\fonts folder.

<b>5.</b> Start foobar and select Columns UI, everything else is already preconfigured.

#

**For standard non-portable installation:**

Install foobar2000 as a standard installation, start and close foobar.<br />
Extract the content ( configuration, georgia-reborn, images and user-components ) from the profile folder<br />
of the **[Github master.zip](https://github.com/TT-ReBORN/Georgia-ReBORN/archive/master.zip)** into the root folder of: C:\Users\YourUsername\AppData\Roaming\foobar2000

Install all located fonts from C:\Users\YourUsername\AppData\Roaming\foobar2000\georgia-reborn\fonts.<br />
The optional image packs need to be extracted in C:\Users\YourUsername\AppData\Roaming\foobar2000\images.

Start foobar and select Columns UI, everything else is already preconfigured.

## FAQ

<details>
<summary>My foobar does not look like in the screenshots, what went wrong?</summary>
<br />
First, check if you have installed everything correctly, go to top menu Help > Georgia-ReBORN theme status and see<br />
if all are checked. You don't need to have the optional image packs installed, but they look pretty cool in Details.<br />
<br />
Second, check if your albums are tagged correctly and if your album folder does contain a cover.<br />
If you want to tag your albums automatically, you can choose between:<br />
foo_MusicBrainz: https://www.foobar2000.org/components/view/foo_musicbrainz<br />
foo_discogs: https://www.foobar2000.org/components/view/foo_discogs
</details>

<details>
<summary>My foobar displays weird icons, what am I missing?</summary>
<br />
You have not installed the fonts correctly, install all located fonts from your foobar2000\profile\georgia-reborn\fonts folder.<br />
For Windows: Into your C:\Windows\Fonts folder.<br />
For Linux: Into your home/user/.local/share/fonts folder.
</details>

<details>
<summary>How do you display flags in the playbar?</summary>
<br />
You need to tag your album with the &lt;ARTISTCOUNTRY&gt; tag:<br />
<br />
In the playlist click on the album cover to select all songs, right click > Properties.<br />
Now click on the +add new button and type ARTISTCOUNTRY. In the value field type the country ( e.g United States ).<br />
Click OK and now the flag should display in the playbar.
</details>

<details>
<summary>How do you display the disc art in Details?</summary>
<br />
If you don't have any disc art, you can choose between 13 self created placeholders:<br />
Options > Details > Disc art > Display disc art placeholder - or<br />
You need to download the disc art from https://fanart.tv and put them in your album folder with the following structure support:<br />

#

<b>For 1 CD:</b>

<b>In root dir of the album:</b>

* <b>Covers:</b><br />
cover.jpg/png, cover2.jpg/png, cover3.jpg/png etc...<br />
folder.jpg/png, folder2.jpg/png, folder3.jpg/png etc...<br />
front.jpg/png, front2.jpg/png, front3.jpg/png etc...

* <b>cdART:</b><br />
cd.png, cd2.png, cd3.png etc...

* <b>vinylART:</b><br />
vinyl.png, vinyl2.png, vinyl3.png etc...

* <b>Booklet:</b><br />
booklet.jpg/png, booklet2.jpg/png, booklet3.jpg/png etc...<br />
artwork.jpg/png, artwork2.jpg/png, artwork3.jpg/png etc...<br />
image.jpg/png, image2.jpg/png, image3.jpg/png etc...<br />
scan.jpg/png, scan2.jpg/png, scan3.jpg/png etc...<br />
back.jpg/png, back2.jpg/png, back3.jpg/png etc...<br />

#

<b>Best choice for a clean folder structure, create in root dir of the album following folder or your choice:<br />
Artwork OR Images OR Scans and put in:</b>

* <b>Covers:</b><br />
cover.jpg/png, cover2.jpg/png, cover3.jpg/png etc...<br />
folder.jpg/png, folder2.jpg/png, folder3.jpg/png etc...<br />
front.jpg/png, front2.jpg/png, front3.jpg/png etc...

* <b>cdART:</b><br />
cd.png, cd2.png, cd3.png etc...

* <b>vinylART:</b><br />
vinyl.png, vinyl2.png, vinyl3.png etc...

* <b>Booklet:</b><br />
booklet.jpg/png, booklet2.jpg/png, booklet3.jpg/png etc...<br />
artwork.jpg/png, artwork2.jpg/png, artwork3.jpg/png etc...<br />
image.jpg/png, image2.jpg/png, image3.jpg/png etc...<br />
scan.jpg/png, scan2.jpg/png, scan3.jpg/png etc...<br />
back.jpg/png, back2.jpg/png, back3.jpg/png etc...<br />

#

<b>For Multi CD:</b>

<b>In root dir of the album:</b>

* <b>Covers:</b><br />
cover.jpg/png, cover2.jpg/png, cover3.jpg/png etc...<br />
folder.jpg/png, folder2.jpg/png, folder3.jpg/png etc...<br />
front.jpg/png, front2.jpg/png, front3.jpg/png etc...

* <b>cdART:</b><br />
cd.png, cd2.png, cd3.png etc...

* <b>vinylART:</b><br />
vinyl.png, vinyl2.png, vinyl3.png etc...

* <b>Booklet:</b><br />
booklet.jpg/png, booklet2.jpg/png, booklet3.jpg/png etc...<br />
artwork.jpg/png, artwork2.jpg/png, artwork3.jpg/png etc...<br />
image.jpg/png, image2.jpg/png, image3.jpg/png etc...<br />
scan.jpg/png, scan2.jpg/png, scan3.jpg/png etc...<br />
back.jpg/png, back2.jpg/png, back3.jpg/png etc...<br />

#

<b>In folders CD1, CD2 etc:</b>

* <b>Covers:</b><br />
cover.jpg/png, cover2.jpg/png, cover3.jpg/png etc...<br />
folder.jpg/png, folder2.jpg/png, folder3.jpg/png etc...<br />
front.jpg/png, front2.jpg/png, front3.jpg/png etc...

* <b>cdART:</b><br />
cd.png, cd2.png, cd3.png etc...

* <b>vinylART:</b><br />
vinyl.png, vinyl2.png, vinyl3.png etc...

* <b>Booklet:</b><br />
booklet.jpg/png, booklet2.jpg/png, booklet3.jpg/png etc...<br />
artwork.jpg/png, artwork2.jpg/png, artwork3.jpg/png etc...<br />
image.jpg/png, image2.jpg/png, image3.jpg/png etc...<br />
scan.jpg/png, scan2.jpg/png, scan3.jpg/png etc...<br />
back.jpg/png, back2.jpg/png, back3.jpg/png etc...<br />

#

<b>Best choice for a clean folder structure, create in root dir of the album following folder or your choice:<br />
Artwork OR Images OR Scans and put in:</b>

* <b>Covers:</b><br />
cover.jpg/png, cover2.jpg/png, cover3.jpg/png etc...<br />
folder.jpg/png, folder2.jpg/png, folder3.jpg/png etc...<br />
front.jpg/png, front2.jpg/png, front3.jpg/png etc...

* <b>cdART:</b><br />
cd.png, cd2.png, cd3.png etc...

* <b>vinylART:</b><br />
vinyl.png, vinyl2.png, vinyl3.png etc...

* <b>Booklet:</b><br />
booklet.jpg/png, booklet2.jpg/png, booklet3.jpg/png etc...<br />
artwork.jpg/png, artwork2.jpg/png, artwork3.jpg/png etc...<br />
image.jpg/png, image2.jpg/png, image3.jpg/png etc...<br />
scan.jpg/png, scan2.jpg/png, scan3.jpg/png etc...<br />
back.jpg/png, back2.jpg/png, back3.jpg/png etc...
</details>

<details>
<summary>How can I set my own lyrics directory?</summary>
<br />
Open your foobar preferences ( File > Preferences ) and go to Tools > Lyric Show 3.<br />
Click on the Lyric Saving tab and under Save method select Save to user defined directory.<br />
Set your path under the Custom directory field, for this example we use D:\Audio\SongLyrics<br />
<br />
Next go to and open your foobar2000\profile\georgia-reborn\js\settings.js<br />
Search for the "tf.lyr_path" and add the path you have set previously in Lyric Show 3.<br />
<br />
tf.lyr_path = [ // simply add, change or re-order entries as needed
	'$replace($replace(%path%,%filename_ext%,),\,\\)',
	fb.ProfilePath + 'lyrics\\',
	fb.FoobarPath + 'lyrics\\',
	'D:\\Audio\\SongLyrics\\',
];
<br />
<br />
Lyrics should be saved now in your new directory and displayed in Georgia-ReBORN.
</details>

<details>
<summary>How can I add or remove tags displayed in Details?</summary>
<br />
You need to edit your georgia-reborn-config file, it can be found in your:<br />
foobar2000\profile\georgia-reborn\georgia-reborn-config.jsonc<br />
<br />
This json file can be edited in any text editor, find the "metadataGrid" section and edit it to your liking,<br />
but be careful that the line you edited ends with a comma, unless it’s the last entry in an object or array.<br />
Make sure you spelled all the required properties correctly and you didn’t inadvertently delete a } or ].<br />
<br />
If something goes wrong and the theme does not load correctly, you can delete the edited config file<br />
and a new one will be automatically created upon next foobar start.
</details>

<details>
<summary>How can I listen to radio streams?</summary>
<br />
That's pretty easy, just download the m3u or pls streaming file format and drag it to your playlist.<br />
You can then delete the m3u or pls streaming files, the streaming information will be saved in the playlist file.<br />
MP3, AAC and OGG codecs are supported.
</details>

<details>
<summary>How can I display artist photos in the library?</summary>
<br />
If you want to display artist photos in the library, you need to link your path to your biography directory.<br />
Go to File > Preferences > Display and under Album art click on the Artist tab. Here you need to set<br />
your full path, e.g: E:\PortableApps\foobar2000\profile\yttm\art_img$cut(%artist%,1)%artist%*<br />
If you now fetch the images from the biography, it will automatically update your library with the photos.<br />
<br />
You can easily switch the view from albums to artists. If album art or flow mode is active, right click<br />
in the library > Show artists, to go back to default view open again the context menu and choose Show albums.
</details>

<details>
<summary>How can I add my own custom view patterns in the playlist and library?</summary>
<br />
In the playlist, right click for the context menu and select:<br />
Grouping > Manage presets<br />
<br />
In the library, click on the settings menu <b>...</b> and navigate to Configure views.<br />
At the bottom, click on the Add new button and paste your custom view pattern, e.g:<br />
<br />
$stripprefix(%album artist%)|%date% %album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%
$swapprefix(%album artist%)|%date% %album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%<br />
<br />
You can also change the view order by clicking the Up and Down buttons located at the bottom.
</details>

<details>
<summary>How do I backup and transfer my playlists?</summary>
<br />
If you want to transfer your playlists to a new foobar installation just copy your old existing<br />
playlists-v1.4 folder in foobar\profile and replace it with the new existing one.
</details>

<details>
<summary>I downloaded the image packs but Artist Logos Part 2 is empty, is it down?</summary>
<br />
No, everything is good. This means the current size of the image pack does not need to be split into two parts<br />
for the Github size limit.
</details>

<details>
<summary>I want to contact you, how?</summary>
<br />
If you want to contact me in private, you can send me a personal message at:<br />
https://hydrogenaud.io/index.php?action=profile;u=139848<br />
or you can write in the general thread at:<br />
https://github.com/TT-ReBORN/Georgia-ReBORN/discussions
</details>


## Support

The official discussion thread for this theme is located at **[Discussions](https://github.com/TT-ReBORN/Georgia-ReBORN/discussions)** or at
**[HydrogenAudio](https://hydrogenaud.io/index.php?topic=121047.0)** and that's a great<br />
place to go for questions and other support issues. If you discover a bug, please open an issue on Github<br />
if you can, or visit **[Mordred's Georgia HydrogenAudio Thread](https://hydrogenaud.io/index.php/topic,116190.0.html)** since most of the code is based on Georgia.

## Help

If you are a developer or have knowledge in Javascript, I would appreciate your help and welcome you<br />
in optimizing Georgia-ReBORN.

## Thanks

Many thanks to **[Mordred](https://github.com/kbuffington)** for his original Georgia theme and help!<br />
Many thanks to **[TheQwertiest](https://github.com/TheQwertiest)** for his SpiderMonkey Panel and Playlist!<br />
Many thanks to **[WilB](https://hydrogenaud.io/index.php?action=profile;u=33113)** for his Biography and Library script!<br />
Many thanks to **[The vern](https://hydrogenaud.io/index.php?action=profile;u=70332)** for his Lyric Show 3 component and **[veksha](https://hydrogenaud.io/index.php?action=profile;u=130067)** for Multisource!<br />
Many thanks to **[zeremy](https://github.com/smoralis)** for his automatic lyric save script to work great along with Lyric Show 3!<br />
Many thanks to **[paregistrase](https://hydrogenaud.io/index.php?action=profile;u=111244)** for his testing and help on Linux!<br />
Many thanks to **[Takaji](https://hydrogenaud.io/index.php?action=profile;u=22787)** for his great ideas and suggestions to make Georgia-ReBORN a better theme!

If you want to support this theme, you can send a donation to Mordred ( author of the original Georgia theme ):<br />
[![donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9LW4ABRYXG2DY&source=url)