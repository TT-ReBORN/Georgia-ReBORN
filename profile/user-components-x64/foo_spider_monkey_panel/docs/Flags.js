// Flags, used with GdiDrawText()
// For more information, see: http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx
const DT_TOP = 0x00000000;
const DT_LEFT = 0x00000000;
const DT_CENTER = 0x00000001;
const DT_RIGHT = 0x00000002;
const DT_VCENTER = 0x00000004;
const DT_BOTTOM = 0x00000008;
const DT_WORDBREAK = 0x00000010;
const DT_SINGLELINE = 0x00000020;
const DT_EXPANDTABS = 0x00000040;
const DT_TABSTOP = 0x00000080;
const DT_NOCLIP = 0x00000100;
const DT_EXTERNALLEADING = 0x00000200;
const DT_CALCRECT = 0x00000400;
const DT_NOPREFIX = 0x00000800;  // NOTE: Please use this flag, or a '&' character will become an underline '_'
const DT_INTERNAL = 0x00001000;
const DT_EDITCONTROL = 0x00002000;
const DT_PATH_ELLIPSIS = 0x00004000;
const DT_END_ELLIPSIS = 0x00008000;
const DT_MODIFYSTRING = 0x00010000;  // do not use
const DT_RTLREADING = 0x00020000;
const DT_WORD_ELLIPSIS = 0x00040000;
const DT_NOFULLWIDTHCHARBREAK = 0x00080000;
const DT_HIDEPREFIX = 0x00100000;
const DT_PREFIXONLY = 0x00200000;

// Used in AppendMenuItem() and AppendTo()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx
const MF_SEPARATOR = 0x00000800;
const MF_ENABLED = 0x00000000;
const MF_GRAYED = 0x00000001;
const MF_DISABLED = 0x00000002;
const MF_UNCHECKED = 0x00000000;
const MF_CHECKED = 0x00000008;
const MF_STRING = 0x00000000;
//var MF_BITMAP = 0x00000004;  // do not use
//var MF_OWNERDRAW = 0x00000100;  // do not use
//var MF_POPUP = 0x00000010; // do not use
const MF_MENUBARBREAK = 0x00000020;
const MF_MENUBREAK = 0x00000040;

// Used in TrackPopupMenu()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx
const TPM_LEFTALIGN       = 0x0000;
const TPM_CENTERALIGN     = 0x0004;
const TPM_RIGHTALIGN      = 0x0008;
const TPM_TOPALIGN        = 0x0000;
const TPM_VCENTERALIGN    = 0x0010;
const TPM_BOTTOMALIGN     = 0x0020;
const TPM_HORIZONTAL      = 0x0000;     /* Horz alignment matters more */
const TPM_VERTICAL        = 0x0040;     /* Vert alignment matters more */
// Animations
const TPM_HORPOSANIMATION = 0x0400;
const TPM_HORNEGANIMATION = 0x0800;
const TPM_VERPOSANIMATION = 0x1000;
const TPM_VERNEGANIMATION = 0x2000;
const TPM_NOANIMATION     = 0x4000;

// Mask for mouse callbacks
const MK_LBUTTON  = 0x0001;
const MK_RBUTTON  = 0x0002;
const MK_SHIFT    = 0x0004; // The SHIFT key is down.
const MK_CONTROL  = 0x0008; // The CTRL key is down.
const MK_MBUTTON  = 0x0010;
const MK_XBUTTON1 = 0x0020;
const MK_XBUTTON2 = 0x0040;

// Used in window.SetCursor()
const IDC_ARROW = 32512;
const IDC_IBEAM = 32513;
const IDC_WAIT = 32514;
const IDC_CROSS = 32515;
const IDC_UPARROW = 32516;
const IDC_SIZE = 32640;
const IDC_ICON = 32641;
const IDC_SIZENWSE = 32642;
const IDC_SIZENESW = 32643;
const IDC_SIZEWE = 32644;
const IDC_SIZENS = 32645;
const IDC_SIZEALL = 32646;
const IDC_NO = 32648;
const IDC_APPSTARTING = 32650;
const IDC_HAND = 32649;
const IDC_HELP = 32651;

// Used in utils.Glob()
// For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx
const FILE_ATTRIBUTE_READONLY            = 0x00000001;
const FILE_ATTRIBUTE_HIDDEN              = 0x00000002;
const FILE_ATTRIBUTE_SYSTEM              = 0x00000004;
const FILE_ATTRIBUTE_DIRECTORY           = 0x00000010;
const FILE_ATTRIBUTE_ARCHIVE             = 0x00000020;
//var FILE_ATTRIBUTE_DEVICE            = 0x00000040; // do not use
const FILE_ATTRIBUTE_NORMAL              = 0x00000080;
const FILE_ATTRIBUTE_TEMPORARY           = 0x00000100;
const FILE_ATTRIBUTE_SPARSE_FILE         = 0x00000200;
const FILE_ATTRIBUTE_REPARSE_POINT       = 0x00000400;
const FILE_ATTRIBUTE_COMPRESSED          = 0x00000800;
const FILE_ATTRIBUTE_OFFLINE             = 0x00001000;
const FILE_ATTRIBUTE_NOT_CONTENT_INDEXED = 0x00002000;
const FILE_ATTRIBUTE_ENCRYPTED           = 0x00004000;
//var FILE_ATTRIBUTE_VIRTUAL           = 0x00010000; // do not use

// With window.DlgCode, can be combined.
// If you don't know what they mean, igonre them.
const DLGC_WANTARROWS            = 0x0001;     /* Control wants arrow keys         */
const DLGC_WANTTAB               = 0x0002;     /* Control wants tab keys           */
const DLGC_WANTALLKEYS           = 0x0004;     /* Control wants all keys           */
const DLGC_WANTMESSAGE           = 0x0004;     /* Pass message to control          */
const DLGC_HASSETSEL             = 0x0008;     /* Understands EM_SETSEL message    */
const DLGC_DEFPUSHBUTTON         = 0x0010;     /* Default pushbutton               */
const DLGC_UNDEFPUSHBUTTON       = 0x0020;     /* Non-default pushbutton           */
const DLGC_RADIOBUTTON           = 0x0040;     /* Radio button                     */
const DLGC_WANTCHARS             = 0x0080;     /* Want WM_CHAR messages            */
const DLGC_STATIC                = 0x0100;     /* Static item: don't include       */
const DLGC_BUTTON                = 0x2000;     /* Button item: can be checked      */

// Used with utils.IsKeyPressed()
const VK_BACK = 0x08;
const VK_TAB = 0x09;
const VK_RETURN = 0x0D;
const VK_SHIFT = 0x10;
const VK_CONTROL = 0x11;
const VK_ALT = 0x12;
const VK_ESCAPE = 0x1B;
const VK_PGUP = 0x21;
const VK_PGDN = 0x22;
const VK_END = 0x23;
const VK_HOME = 0x24;
const VK_LEFT = 0x25;
const VK_UP = 0x26;
const VK_RIGHT = 0x27;
const VK_DOWN = 0x28;
const VK_INSERT = 0x2D;
const VK_DELETE = 0x2E;
const VK_SPACEBAR = 0x20;

// Used in IFbTooltip.GetDelayTime() and IFbTooltip.SetDelayTime()
// For more information, see: http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx
const TTDT_AUTOMATIC = 0;
const TTDT_RESHOW = 1;
const TTDT_AUTOPOP = 2;
const TTDT_INITIAL =3;

// Used in gdi.Font(), can be combined
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534124(VS.85).aspx
const FontStyle = {
    Regular: 0,
    Bold: 1,
    Italic: 2,
    BoldItalic: 3,
    Underline: 4,
    Strikeout: 8
};

// Used in SetTextRenderingHint()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx
const TextRenderingHint = {
    SystemDefault: 0,
    SingleBitPerPixelGridFit: 1,
    SingleBitPerPixel: 2,
    AntiAliasGridFit: 3,
    AntiAlias: 4,
    ClearTypeGridFit: 5
};

// Used in SetSmoothingMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx
const SmoothingMode = {
    Invalid: -1,
    Default: 0,
    HighSpeed: 1,
    HighQuality: 2,
    None: 3,
    AntiAlias: 4
};

// Used in SetInterpolationMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx
const InterpolationMode = {
    Invalid: -1,
    Default: 0,
    LowQuality: 1,
    HighQuality: 2,
    Bilinear: 3,
    Bicubic: 4,
    NearestNeighbor: 5,
    HighQualityBilinear: 6,
    HighQualityBicubic: 7
};

// Used in RotateFlip()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534171(VS.85).aspx
const RotateFlipType = {
    RotateNoneFlipNone: 0,
    Rotate90FlipNone: 1,
    Rotate180FlipNone: 2,
    Rotate270FlipNone: 3,

    RotateNoneFlipX: 4,
    Rotate90FlipX: 5,
    Rotate180FlipX: 6,
    Rotate270FlipX: 7,

    RotateNoneFlipY: 6,
    Rotate90FlipY: 7,
    Rotate180FlipY: 4,
    Rotate270FlipY: 5,

    RotateNoneFlipXY: 2,
    Rotate90FlipXY: 3,
    Rotate180FlipXY: 0,
    Rotate270FlipXY: 1
};

// h_align/v_align:
// http://msdn.microsoft.com/en-us/library/ms534177(VS.85).aspx
const StringAlignment = {
    Near: 0,
    Center: 1,
    Far: 2
};

// trimming:
// http://msdn.microsoft.com/en-us/library/ms534403(VS.85).aspx
const StringTrimming = {
    None: 0,
    Character: 1,
    Word: 2,
    EllipsisCharacter: 3,
    EllipsisWord: 4,
    EllipsisPath: 5
};

// flags, can be combined of:
// http://msdn.microsoft.com/en-us/library/ms534181(VS.85).aspx
const StringFormatFlags = {
    DirectionRightToLeft: 0x00000001,
    DirectionVertical: 0x00000002,
    NoFitBlackBox: 0x00000004,
    DisplayFormatControl: 0x00000020,
    NoFontFallback: 0x00000400,
    MeasureTrailingSpaces: 0x00000800,
    NoWrap: 0x00001000,
    LineLimit: 0x00002000,
    NoClip: 0x00004000
};

// Used in utils.GetAlbumArt()
const AlbumArtId = {
    front: 0,
    back: 1,
    disc: 2,
    icon: 3,
    artist: 4
};

// Used in window.GetColourCUI()
const ColourTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};

// Used in window.GetFontCUI()
const FontTypeCUI = {
    items: 0,
    labels: 1
};

// Used in window.GetColourDUI()
const ColourTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};

// Used in window.GetFontDUI()
const FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};
