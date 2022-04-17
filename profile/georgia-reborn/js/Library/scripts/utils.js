let my_utilsLib = {}

my_utilsLib.scriptInfo = window.ScriptInfo;
// my_utilsLib.packageInfo = utils.GetPackageInfo(my_utilsLib.scriptInfo.PackageId);
my_utilsLib.packagePath = `${basePath}js\\library/`;

my_utilsLib.getAsset = assetFile => utils.ReadTextFile(`${basePath}js\\library\\assets/${assetFile}`);
my_utilsLib.getImageAssets = assetFolder => utils.Glob(`${basePath}js\\library\\assets\\images/${assetFolder}/*`);
my_utilsLib.getScriptPath = `${basePath}js\\library\\scripts\\`;
