// filename에서 경로와 확장자를 제외하고 파일명만 남긴다
export var getPureFileName = function (filepath) {
    var extractedName = /(?!.*\\)([\w|\-|\_|\d|.]*)(?=\.\w+$)/.exec(filepath)[0];
    return extractedName;
};
var localStorageInterface = {
    save: function (key, value) { return localStorage.setItem(key, JSON.stringify(value)); },
    load: function (key) { return JSON.parse(localStorage.getItem(key)); }
};
var createManifestData = function (name) {
    return {
        name: name,
        timestamp: +new Date()
    };
};
var createYAMLStorage = function (storage) {
    var KEYOF_MAPS = 'MARYO-KEYS'; // 저장된 key 목록이 저장된 key의 이름
    var DATA_PREFIX = 'MARYO-DATA-'; // 저장된 데이터 key의 suffix
    //#region Key 관련 조작 함수
    var getLists = function () { return storage.load(KEYOF_MAPS) || []; };
    var saveLists = function (keys) { return storage.save(KEYOF_MAPS, keys); };
    var updateKeys = function (key) {
        // 업데이트 할 키를 제외한 기존 키 추출
        var recentKeys = getLists().filter(function (k) { return k.name !== key; });
        saveLists(recentKeys.concat([createManifestData(key)]));
    };
    var addDataPrefixKey = function (key) { return "" + DATA_PREFIX + key; };
    //#endregion
    var save = function (key, value) {
        updateKeys(key);
        storage.save(addDataPrefixKey(key), value);
    };
    var load = function (key) {
        return storage.load(addDataPrefixKey(key)) || {};
    };
    return { getLists: getLists, save: save, load: load };
};
export default createYAMLStorage(localStorageInterface);
