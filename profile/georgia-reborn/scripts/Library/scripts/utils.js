'use strict';

const my_utilsLib = {};

my_utilsLib.scriptInfo = window.ScriptInfo;
// my_utilsLib.packageInfo = utils.GetPackageInfo(my_utilsLib.scriptInfo.PackageId);
my_utilsLib.packagePath = `${basePath}scripts\\library/`;

my_utilsLib.getAsset = assetFile => utils.ReadTextFile(`${basePath}scripts\\library\\assets/${assetFile}`);
my_utilsLib.getImageAssets = assetFolder => utils.Glob(`${basePath}scripts\\library\\assets\\images/${assetFolder}/*`);
my_utilsLib.getScriptPath = `${basePath}scripts\\library\\scripts\\`;
