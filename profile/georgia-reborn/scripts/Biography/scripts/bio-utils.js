'use strict';

/** @global @type {object} */
const bio_my_utils = {};

bio_my_utils.scriptInfo = window.ScriptInfo;
// bio_my_utils.packageInfo = utils.GetPackageInfo(bio_my_utils.scriptInfo.PackageId);
bio_my_utils.packagePath = `${grPath.base}scripts\\biography\\`;

bio_my_utils.getAsset = assetFile => utils.ReadTextFile(`${grPath.base}scripts\\biography\\assets\\${assetFile}`);
bio_my_utils.getImageAsset = assetFile => gdi.Image(`${grPath.base}scripts\\biography\\assets\\images\\${assetFile}`);
bio_my_utils.getFlagAsset = assetFile => gdi.Image(`${grPath.base}scripts\\biography\\assets\\images\\flags\\${assetFile}`);
bio_my_utils.getScriptPath = `${grPath.base}scripts\\biography\\scripts\\`;
