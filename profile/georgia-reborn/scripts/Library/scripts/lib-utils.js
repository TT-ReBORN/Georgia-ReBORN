'use strict';

/** @global @type {object} */
const lib_my_utils = {};

lib_my_utils.scriptInfo = window.ScriptInfo;
// lib_my_utils.packageInfo = utils.GetPackageInfo(lib_my_utils.scriptInfo.PackageId);
lib_my_utils.packagePath = `${grPath.base}scripts\\library\\`;

lib_my_utils.getAsset = assetFile => utils.ReadTextFile(`${grPath.base}scripts\\library\\assets\\${assetFile}`);
lib_my_utils.getImageAssets = assetFolder => utils.Glob(`${grPath.base}scripts\\library\\assets\\images\\${assetFolder}\\*`);
lib_my_utils.getScriptPath = `${grPath.base}scripts\\library\\scripts\\`;
