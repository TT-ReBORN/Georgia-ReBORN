let my_utilsBio = {}

my_utilsBio.scriptInfo = window.ScriptInfo;
// my_utilsBio.packageInfo = utils.GetPackageInfo(my_utilsBio.scriptInfo.PackageId);
my_utilsBio.packagePath = `${basePath}js\\biography/`;

my_utilsBio.getAsset = assetFile => utils.ReadTextFile(`${basePath}js\\biography\\assets/${assetFile}`);
my_utilsBio.getImageAsset = assetFile => gdi.Image(`${basePath}js\\biography\\assets\\images/${assetFile}`);
my_utilsBio.getScriptPath = `${basePath}js\\biography\\scripts/`;