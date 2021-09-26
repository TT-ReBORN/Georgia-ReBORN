let my_utilsLib = {}

my_utilsLib.scriptInfo = window.ScriptInfo;
//my_utilsLib.packageInfo = utils.GetPackageInfo(my_utilsLib.scriptInfo.PackageId);
my_utilsLib.packagePath = `${basePath}js\\Library/`;

my_utilsLib.getAsset = assetFile => utils.ReadTextFile(`${basePath}js\\Library\\assets/${assetFile}`);
my_utilsLib.getImageAssets = assetFolder => utils.Glob(`${basePath}js\\Library\\assets\\images/${assetFolder}/*`);
my_utilsLib.getScriptPath = `${basePath}js\\Library\\scripts\\`;
