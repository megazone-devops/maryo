interface IStorage {
  save: (key: string, value: any) => void;
  load: (key: string) => any;
}

interface IStorageKeyData {
  name: string;
  timestamp: number;
}

// filename에서 경로와 확장자를 제외하고 파일명만 남긴다
export const getPureFileName = filepath => {
  const extractedName = /(?!.*\\)([\w|\-|\_|\d|.]*)(?=\.\w+$)/.exec(
    filepath
  )[0];
  return extractedName;
};

const localStorageInterface: IStorage = {
  save: (key, value: any) => localStorage.setItem(key, JSON.stringify(value)),
  load: (key: string) => JSON.parse(localStorage.getItem(key)),
};

const createManifestData = (name: string): IStorageKeyData => {
  return {
    name,
    timestamp: +new Date(),
  };
};

const createYAMLStorage = (storage: IStorage) => {
  const KEYOF_MAPS = 'MARYO-KEYS'; // 저장된 key 목록이 저장된 key의 이름
  const DATA_PREFIX = 'MARYO-DATA-'; // 저장된 데이터 key의 suffix

  //#region Key 관련 조작 함수
  const getLists = () => (storage.load(KEYOF_MAPS) as IStorageKeyData[]) || [];
  const saveLists = (keys: IStorageKeyData[]) => storage.save(KEYOF_MAPS, keys);
  const updateKeys = (key: string) => {
    // 업데이트 할 키를 제외한 기존 키 추출
    const recentKeys = getLists().filter(k => k.name !== key);
    saveLists([...recentKeys, createManifestData(key)]);
  };
  const addDataPrefixKey = key => `${DATA_PREFIX}${key}`;
  //#endregion

  const save = (key: string, value) => {
    updateKeys(key);
    storage.save(addDataPrefixKey(key), value);
  };

  const load = (key: string) => {
    return storage.load(addDataPrefixKey(key)) || {};
  };

  return { getLists, save, load };
};

export default createYAMLStorage(localStorageInterface);
