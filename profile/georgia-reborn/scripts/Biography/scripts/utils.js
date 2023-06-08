'use strict';

const my_utilsBio = {};

my_utilsBio.scriptInfo = window.ScriptInfo;
// my_utilsBio.packageInfo = utils.GetPackageInfo(my_utilsBio.scriptInfo.PackageId);
my_utilsBio.packagePath = `${basePath}scripts\\biography/`;

my_utilsBio.getAsset = assetFile => utils.ReadTextFile(`${basePath}scripts\\biography\\assets/${assetFile}`);
my_utilsBio.getImageAsset = assetFile => gdi.Image(`${basePath}scripts\\biography\\assets\\images/${assetFile}`);
my_utilsBio.getFlagAsset = assetFile => gdi.Image(`${basePath}scripts\\biography\\assets\\images\\flags/${assetFile}`);
my_utilsBio.getScriptPath = `${basePath}scripts\\biography\\scripts/`;
