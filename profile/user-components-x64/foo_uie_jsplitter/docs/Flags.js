/**
 *  @module Flags 
 */

/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000000
 */
const DT_TOP = 0x00000000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000000
 */
const DT_LEFT = 0x00000000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000001
 */
const DT_CENTER = 0x00000001;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000002
 */
const DT_RIGHT = 0x00000002;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000004
 */
const DT_VCENTER = 0x00000004;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000008
 */
const DT_BOTTOM = 0x00000008;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000010
 */
const DT_WORDBREAK = 0x00000010;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000020
 */
const DT_SINGLELINE = 0x00000020;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000040
 */
const DT_EXPANDTABS = 0x00000040;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000080
 */
const DT_TABSTOP = 0x00000080;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000100
 */
const DT_NOCLIP = 0x00000100;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000200
 */
const DT_EXTERNALLEADING = 0x00000200;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000400
 */
const DT_CALCRECT = 0x00000400;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}<br>
 * NOTE: Please use this flag, or a '&' character will become an underline '_'
 * @memberof module:Flags
 * @default 0x00000800
 */
const DT_NOPREFIX = 0x00000800;  // NOTE: Please use this flag, or a '&' character will become an underline '_'
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00001000
 */
const DT_INTERNAL = 0x00001000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00002000
 */
const DT_EDITCONTROL = 0x00002000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00004000
 */
const DT_PATH_ELLIPSIS = 0x00004000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00008000
 */
const DT_END_ELLIPSIS = 0x00008000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}<br>
 * DO NOT USE
 * @memberof module:Flags
 * @default 0x00010000
 */
const DT_MODIFYSTRING = 0x00010000;  // DO NOT USE
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00020000
 */
const DT_RTLREADING = 0x00020000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00040000
 */
const DT_WORD_ELLIPSIS = 0x00040000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00080000
 */
const DT_NOFULLWIDTHCHARBREAK = 0x00080000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00100000
 */
const DT_HIDEPREFIX = 0x00100000;
/** 
 * Flag used with {@link GdiGraphics#GdiDrawText GdiDrawText}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00200000
 */
const DT_PREFIXONLY = 0x00200000;

/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000800
 */
const MF_SEPARATOR = 0x00000800;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000000
 */
const MF_ENABLED = 0x00000000;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000001
 */
const MF_GRAYED = 0x00000001;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000002
 */
const MF_DISABLED = 0x00000002;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000000
 */
const MF_UNCHECKED = 0x00000000;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000008
 */
const MF_CHECKED = 0x00000008;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000000
 */
const MF_STRING = 0x00000000;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000020
 */
const MF_MENUBARBREAK = 0x00000020;
/** 
 * Used in {@link MenuObject#AppendMenuItem AppendMenuItem} and {@link MenuObject#AppendTo AppendTo}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x00000040
 */
const MF_MENUBREAK = 0x00000040;

/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0000
 */
const TPM_LEFTALIGN       = 0x0000;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0004
 */
const TPM_CENTERALIGN     = 0x0004;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0008
 */
const TPM_RIGHTALIGN      = 0x0008;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0000
 */
const TPM_TOPALIGN        = 0x0000;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0010
 */
const TPM_VCENTERALIGN    = 0x0010;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0020
 */
const TPM_BOTTOMALIGN     = 0x0020;
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0000
 */
const TPM_HORIZONTAL      = 0x0000;     /* Horz alignment matters more */
/** 
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}<br>
 * NOTE: Vert alignment matters more
 * @memberof module:Flags
 * @default 0x0040
 */
const TPM_VERTICAL        = 0x0040;     /* Vert alignment matters more */

/**
 * Animations
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0400
 */
const TPM_HORPOSANIMATION = 0x0400;
/**
 * Animations
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x0800
 */
const TPM_HORNEGANIMATION = 0x0800;
/**
 * Animations
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x1000
 */
const TPM_VERPOSANIMATION = 0x1000;
/**
 * Animations
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x2000
 */
const TPM_VERNEGANIMATION = 0x2000;
/**
 * Animations
 * Used in {@link MenuObject#TrackPopupMenu TrackPopupMenu}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms648002(VS.85).aspx}
 * @memberof module:Flags
 * @default 0x4000
 */
const TPM_NOANIMATION     = 0x4000;

/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0001
 */
const MK_LBUTTON  = 0x0001;
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0002
 */
const MK_RBUTTON  = 0x0002;
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0004
 */
const MK_SHIFT    = 0x0004;
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0008
 */
const MK_CONTROL  = 0x0008; // The CTRL key is down.
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0010
 */
const MK_MBUTTON  = 0x0010;
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0020
 */
const MK_XBUTTON1 = 0x0020;
/** 
 * Mask for mouse callbacks (on_mouse_*)
 * @memberof module:Flags
 * @default 0x0040
 */
const MK_XBUTTON2 = 0x0040;

/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_ARROW = 32512;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_IBEAM = 32513;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_WAIT = 32514;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_CROSS = 32515;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_UPARROW = 32516;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZE = 32640;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_ICON = 32641;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZENWSE = 32642;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZENESW = 32643;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZEWE = 32644;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZENS = 32645;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_SIZEALL = 32646;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_NO = 32648;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_APPSTARTING = 32650;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_HAND = 32649;
/**
 * Used in {@link window.SetCursor}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setcursor}
 * @memberof module:Flags
 * @default
 */
const IDC_HELP = 32651;

/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000001
 */
const FILE_ATTRIBUTE_READONLY            = 0x00000001;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000002
 */
const FILE_ATTRIBUTE_HIDDEN              = 0x00000002;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000004
 */
const FILE_ATTRIBUTE_SYSTEM              = 0x00000004;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000010
 */
const FILE_ATTRIBUTE_DIRECTORY           = 0x00000010;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000020
 */
const FILE_ATTRIBUTE_ARCHIVE             = 0x00000020;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000080
 */
const FILE_ATTRIBUTE_NORMAL              = 0x00000080;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000100
 */
const FILE_ATTRIBUTE_TEMPORARY           = 0x00000100;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000200
 */
const FILE_ATTRIBUTE_SPARSE_FILE         = 0x00000200;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000400
 */
const FILE_ATTRIBUTE_REPARSE_POINT       = 0x00000400;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00000800
 */
const FILE_ATTRIBUTE_COMPRESSED          = 0x00000800;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00001000
 */
const FILE_ATTRIBUTE_OFFLINE             = 0x00001000;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00002000
 */
const FILE_ATTRIBUTE_NOT_CONTENT_INDEXED = 0x00002000;
/**
 * Used in {@link utils.Glob}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx}
 * @memberof module:Flags
 * @default 0x00004000
 */
const FILE_ATTRIBUTE_ENCRYPTED           = 0x00004000;

/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0001
 */
const DLGC_WANTARROWS            = 0x0001;     /* Control wants arrow keys         */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0002
 */
const DLGC_WANTTAB               = 0x0002;     /* Control wants tab keys           */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0004
 */
const DLGC_WANTALLKEYS           = 0x0004;     /* Control wants all keys           */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0004
 */
const DLGC_WANTMESSAGE           = 0x0004;     /* Pass message to control          */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0008
 */
const DLGC_HASSETSEL             = 0x0008;     /* Understands EM_SETSEL message    */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0010
 */
const DLGC_DEFPUSHBUTTON         = 0x0010;     /* Default pushbutton               */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0020
 */
const DLGC_UNDEFPUSHBUTTON       = 0x0020;     /* Non-default pushbutton           */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0040
 */
const DLGC_RADIOBUTTON           = 0x0040;     /* Radio button                     */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0080
 */
const DLGC_WANTCHARS             = 0x0080;     /* Want WM_CHAR messages            */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x0100
 */
const DLGC_STATIC                = 0x0100;     /* Static item: don't include       */
/**
 * With {@link window.DlgCode}, can be combined.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/dlgbox/wm-getdlgcode}
 * If you don't know what they mean, igonre them.
 * @memberof module:Flags
 * @default 0x2000
 */
const DLGC_BUTTON                = 0x2000;     /* Button item: can be checked      */

/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x08
 */
const VK_BACK = 0x08;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x09
 */
const VK_TAB = 0x09;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x0D
 */
const VK_RETURN = 0x0D;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x10
 */
const VK_SHIFT = 0x10;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x11
 */
const VK_CONTROL = 0x11;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x12
 */
const VK_ALT = 0x12;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x1B
 */
const VK_ESCAPE = 0x1B;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x21
 */
const VK_PGUP = 0x21;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x22
 */
const VK_PGDN = 0x22;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x23
 */
const VK_END = 0x23;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x24
 */
const VK_HOME = 0x24;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x25
 */
const VK_LEFT = 0x25;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x26
 */
const VK_UP = 0x26;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x27
 */
const VK_RIGHT = 0x27;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x28
 */
const VK_DOWN = 0x28;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x2D
 */
const VK_INSERT = 0x2D;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x2E
 */
const VK_DELETE = 0x2E;
/**
 * Used with {@link utils.IsKeyPressed}, {@link module:Callbacks.on_key_down on_key_down}, {@link module:Callbacks.on_key_up on_key_up}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes}
 * @memberof module:Flags
 * @default 0x20
 */
const VK_SPACEBAR = 0x20;

/**
 * Used in {@link FbTooltip#GetDelayTime GetDelayTime} and {@link FbTooltip#SetDelayTime SetDelayTime}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const TTDT_AUTOMATIC = 0;
/**
 * Used in {@link FbTooltip#GetDelayTime GetDelayTime} and {@link FbTooltip#SetDelayTime SetDelayTime}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const TTDT_RESHOW = 1;
/**
 * Used in {@link FbTooltip#GetDelayTime GetDelayTime} and {@link FbTooltip#SetDelayTime SetDelayTime}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const TTDT_AUTOPOP = 2;
/**
 * Used in {@link FbTooltip#GetDelayTime GetDelayTime} and {@link FbTooltip#SetDelayTime SetDelayTime}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const TTDT_INITIAL = 3;

/**
 * Used in {@link gdi.Font}, can be combined.<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534124(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const FontStyle = {
    Regular: 0,
    Bold: 1,
    Italic: 2,
    BoldItalic: 3,
    Underline: 4,
    Strikeout: 8
};

/**
 * Used in {@link GdiGraphics#SetTextRenderingHint SetTextRenderingHint}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const TextRenderingHint = {
    SystemDefault: 0,
    SingleBitPerPixelGridFit: 1,
    SingleBitPerPixel: 2,
    AntiAliasGridFit: 3,
    AntiAlias: 4,
    ClearTypeGridFit: 5
};

/**
 * Used in {@link GdiGraphics#SetSmoothingMode SetSmoothingMode}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const SmoothingMode = {
    Invalid: -1,
    Default: 0,
    HighSpeed: 1,
    HighQuality: 2,
    None: 3,
    AntiAlias: 4
};

/**
 * Used in {@link GdiGraphics#SetInterpolationMode SetInterpolationMode}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
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

/**
 * Used in {@link GdiBitmap#RotateFlip RotateFlip}<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534171(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
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

/**
 * h_align/v_align:<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534177(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const StringAlignment = {
    Near: 0,
    Center: 1,
    Far: 2
};

/**
 * trimming:<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534403(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
const StringTrimming = {
    None: 0,
    Character: 1,
    Word: 2,
    EllipsisCharacter: 3,
    EllipsisWord: 4,
    EllipsisPath: 5
};

/**
 * flags for StringFormat (helpers) can be combined of:<br>
 * For more information, see: {@link http://msdn.microsoft.com/en-us/library/ms534181(VS.85).aspx}
 * @memberof module:Flags
 * @default
 */
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

/**
 * Used in {@link utils.GetAlbumArtV2}, {@link utils.GetAlbumArtEmbedded}, {@link utils.GetAlbumArtAsync}, {@link utils.GetAlbumArtAsyncV2}
 * @memberof module:Flags
 * @default
 */
const AlbumArtId = {
    front: 0,
    back: 1,
    disc: 2,
    icon: 3,
    artist: 4
};

/**
 * Used in {@link window.GetColourCUI}
 * @memberof module:Flags
 * @default
 */
const ColourTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};

/**
 * Used in {@link window.GetFontCUI}
 * @memberof module:Flags
 * @default
 */
const FontTypeCUI = {
    items: 0,
    labels: 1
};

/**
 * Used in {@link window.GetColourDUI}
 * @memberof module:Flags
 * @default
 */
const ColourTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};

/**
 * Used in {@link window.GetFontDUI}
 * @memberof module:Flags
 * @default
 */
const FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};

/**
 * Used as a result of {@link plman.PlaybackOrder} and in {@link module:Callbacks.on_playback_order_changed on_playback_order_changed}
 * @memberof module:Flags
 * @default
 */
const PlaybackOrder = {
    Default: 0,
    RepeatPlaylist: 1,
    RepeatTrack: 2,
    Random: 3,
    ShuffleTracks: 4,
    ShuffleAlbums: 5,
    ShuffleFolders: 6    
};

/**
 * Used in {@link module:Callbacks.on_playback_queue_changed on_playback_queue_changed}
 * @memberof module:Flags
 * @default
 */
const QueueChangeOrigin = {
    UserAdded: 0,
    UserRemoved: 1,
    PlaybackAdvance: 2
};

/**
 * Used in {@link module:Callbacks.on_playback_starting on_playback_starting}
 * @memberof module:Flags
 * @default
 */
const PlaybackStartCmd = {
    Default: 0,
    Play: 1,
    PlayNext: 2,
    PlayPrevious: 3,
    SetTrack: 4,
    PlayRandom: 5,
    Resume: 6
};

/**
 * Used in {@link module:Callbacks.on_playback_stop on_playback_stop}
 * @memberof module:Flags
 * @default
 */
const PlaybackStopReason = {
    InvokedByUser: 0,
    EndOfFile: 1,
    StartingAnotherTrack: 2,
    PlayerShutDown: 3
};

/**
 * Used in {@link module:Callbacks.on_playback_stop on_playback_stop}
 * @memberof module:Flags
 * @default
 */
const ReplayGainMode = {
    None: 0,
    Track: 1,
    Album: 2,
    TrackAlbumByPlaybackOrder: 3
};

/**
 * Used as a result of {@link fb.GetSelectionType}
 * @memberof module:Flags
 * @default
 */
const SelectionType = {
    Undefined: 0,
    ActivePlaylistSelection: 1,
    CallerActivePlaylist: 2,
    PlaylistManager: 3,
    NowPlaying: 4,
    KeyboardShortcutList: 5,
    MediaLibraryViewer: 6
};

/** 
 * lower case letters<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00000100
 */
const LCMAP_LOWERCASE =           0x00000100; // lower case letters
/** 
 * UPPER CASE LETTERS<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00000200
 */
const LCMAP_UPPERCASE =           0x00000200; // UPPER CASE LETTERS
/** 
 * Title Case Letters<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00000300
 */
const LCMAP_TITLECASE =           0x00000300; // Title Case Letters
/** 
 * WC sort key (normalize)<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00000400
 */
const LCMAP_SORTKEY =             0x00000400; // WC sort key (normalize)
/** 
 * byte reversal<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00000800
 */
const LCMAP_BYTEREV =             0x00000800; // byte reversal
/** 
 * map katakana to hiragana<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00100000
 */
const LCMAP_HIRAGANA =            0x00100000; // map katakana to hiragana
/** 
 * map hiragana to katakana<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00200000
 */
const LCMAP_KATAKANA =            0x00200000; // map hiragana to katakana
/** 
 * map double byte to single byte<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00400000
 */
const LCMAP_HALFWIDTH =           0x00400000; // map double byte to single byte
/** 
 * map single byte to double byte<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x00800000
 */
const LCMAP_FULLWIDTH =           0x00800000; // map single byte to double byte
/** 
 * use linguistic rules for casing<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x01000000
 */
const LCMAP_LINGUISTIC_CASING =   0x01000000; // use linguistic rules for casing
/** 
 * map traditional chinese to simplified chinese<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x02000000
 */
const LCMAP_SIMPLIFIED_CHINESE =  0x02000000; // map traditional chinese to simplified chinese
/** 
 * map simplified chinese to traditional chinese<br>
 * Flag used with {@link utils.MapString}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/api/winnls/nf-winnls-lcmapstringex}
 * @memberof module:Flags
 * @default 0x04000000
 */
const LCMAP_TRADITIONAL_CHINESE = 0x04000000; // map simplified chinese to traditional chinese

/**
 * Used as a result of {@link window.InstanceType}
 * @memberof module:Flags
 * @default
 */
const UIInstanceType = {
    ColumnsUI: 0,
    DefaultUI: 1
};

/**
 * SupportColourFlagCUI = {
 *     text: 0x0,
 *     selection_text: 0x2,
 *     inactive_selection_text: 0x4,
 *     background: 0x8,
 *     selection_background: 0x10;
 *     inactive_selection_background: 0x20,
 *     active_item_frame: 0x40,
 *     group_foreground: 0x80,
 *     group_background: 0x100,
 *     colour_flag_all: 0x1ff
 * };
 * 
 * === Colours ===
 * Used in GetColourCUI() as client_guid
 * NG Playlist: "{C882D3AC-C014-44DF-9C7E-2DADF37645A0}" Support Bits: 0x000001ff
 * Columns Playlist: "{0CF29D60-1262-4F55-A6E1-BC4AE6579D19}" Support Bits: 0x000001ff
 * Item Details: "{4E20CEED-42F6-4743-8EB3-610454457E19}" Support Bits: 0x00000009
 * Album List: "{DA66E8F3-D210-4AD2-89D4-9B2CC58D0235}" Support Bits: 0x00000049
 * Filter Panel: "{4D6774AF-C292-44AC-8A8F-3B0855DCBDF4}" Support Bits: 0x000001ff
 * Biography View: "{1CE33A5C-1D79-48F7-82EF-089EC49A9CA3}" Support Bits: 0x00000059
 * Artwork View: "{E32DCBA9-A2BF-4901-AB43-228628071410}" Support Bits: 0x00000008
 * Playlist Switcher: "{EB38A997-3B5F-4126-8746-262AA9C1F94B}" Support Bits: 0x000001ff
 * Item Properties: "{862F8A37-16E0-4A74-B27E-2B73DB567D0F}" Support Bits: 0x000001ff
 * 
 * === Fonts ===
 * Used in GetFontCUI() as client_guid
 * Album List: "{06B856CC-86E7-4459-A75C-2DAB5B33B8BB}"
 * Item Properties: Group Titles: "{AF5A96A6-96ED-468F-8BA1-C22533C53491}"
 * Columns Playlist: Items: "{82196D79-69BC-4041-8E2A-E3B4406BB6FC}"
 * NG Playlist: Group Titles: "{FB127FFA-1B35-4572-9C1A-4B96A5C5D537}"
 * NG Playlist: Column Titles: "{30FBD64C-2031-4F0B-A937-F21671A2E195}"
 * Playlist Switcher: "{70A5C273-67AB-4BB6-B61C-F7975A6871FD}"
 * Filter Panel: Column Titles: "{FCA8752B-C064-41C4-9BE3-E125C7C7FC34}"
 * Columns Playlist: Column Titles: "{C0D3B76C-324D-46D3-BB3C-E81C7D3BCB85}"
 * Tab Stack: "{6F000FC4-3F86-4FC5-80EA-F7AA4D9551E6}"
 * Console: "{26059FEB-488B-4CE1-824E-4DF113B4558E}"
 * Biography View: "{F692FE36-D0CB-40A9-A53E-1492D6EFAC65}"
 * NG Playlist: Items: "{19F8E0B3-E822-4F07-B200-D4A67E4872F9}"
 * Playlist Tabs: "{942C36A4-4E28-4CEA-9644-F223C9A838EC}"
 * Status Bar: "{B9D5EA18-5827-40BE-A896-302A71BCAA9C}"
 * Item Details: "{77F3FA70-E39C-46F8-8E8A-6ECC64DDE234}"
 * Item Properties: Column Titles: "{7B9DF268-4ECC-4E10-A308-E145DA9692A5}"
 * Item Properties: Items: "{755FBB3D-A8D4-46F3-B0BA-005B0A10A01A}"
 * Filter Panel: Items: "{D93F1EF3-4AEE-4632-B5BF-0220CEC76DED}"
*/
