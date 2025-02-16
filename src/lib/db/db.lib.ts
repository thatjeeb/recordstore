import { dbConsts, StoreName } from "./db.definition";

const handleRequestError = (request: IDBRequest, reject: (reason?: unknown) => void, action: string, storeName?: StoreName): void => {
  const error = request.error?.message;

  let msg = "";
  if (error) {
    msg = `Error when ${action} in db. Store name: ${storeName}. Error: ${error}`;
  } else {
    msg = `Unknown error when ${action} in db. Store name: ${storeName || "none"}`;
  }

  console.error(msg);
  reject(msg);
};

const initDb = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onupgradeneeded = (): void => {
      const db = openRequest.result;
      db.createObjectStore(StoreName.Playlist, { keyPath: "id" });
      db.createObjectStore(StoreName.Album, { keyPath: "id" });
    };

    openRequest.onsuccess = (): void => {
      resolve();
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during initDb");
    };
  });
};

const count = (storeName: StoreName): Promise<number> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const countRequest = store.count();

      countRequest.onsuccess = (): void => {
        resolve(countRequest.result);
      };

      countRequest.onerror = (): void => {
        handleRequestError(countRequest, reject, "getting data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during count");
    };
  });
};

const getItem = <T>(storeName: StoreName, key: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const getAllRequest = store.get(key);

      getAllRequest.onsuccess = (): void => {
        resolve(getAllRequest.result);
      };

      getAllRequest.onerror = (): void => {
        handleRequestError(getAllRequest, reject, "getting data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during getItem");
    };
  });
};

const getAllItems = <T>(storeName: StoreName): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = (): void => {
        resolve(getAllRequest.result);
      };

      getAllRequest.onerror = (): void => {
        handleRequestError(getAllRequest, reject, "getting all data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during getAllItems");
    };
  });
};

const addItem = <T>(storeName: StoreName, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const addRequest = store.add(item);

      addRequest.onsuccess = (): void => {
        resolve();
      };

      addRequest.onerror = (): void => {
        handleRequestError(addRequest, reject, "adding data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during addItem", storeName);
    };
  });
};

const addMultipleItems = <T>(storeName: StoreName, items: T[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      let success = true;
      const msg = "Error adding multiple items";

      for (const item of items) {
        const addRequest = store.add(item);

        addRequest.onsuccess = (): void => {
          //
        };

        addRequest.onerror = (): void => {
          success = false;
          handleRequestError(addRequest, () => {}, "adding multiple items", storeName);
        };
      }

      if (success) {
        resolve();
      } else {
        reject(msg);
      }
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during addMultipleItems", storeName);
    };
  });
};

const updateItem = <T>(storeName: StoreName, item: T): Promise<T> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const updateRequest = store.put(item);

      updateRequest.onsuccess = (): void => {
        resolve(item);
      };

      updateRequest.onerror = (): void => {
        handleRequestError(updateRequest, reject, "updating item", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during updateItem", storeName);
    };
  });
};

const deleteItem = (storeName: StoreName, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const deleteRequest = store.delete(key);

      deleteRequest.onsuccess = (): void => {
        resolve();
      };

      deleteRequest.onerror = (): void => {
        handleRequestError(deleteRequest, reject, "deleting data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during deleteItem", storeName);
    };
  });
};

const deleteAllItems = (storeName: StoreName): Promise<void> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbConsts.name, dbConsts.version);

    openRequest.onsuccess = (): void => {
      const db = openRequest.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const clearRequest = store.clear();

      clearRequest.onsuccess = (): void => {
        resolve();
      };

      clearRequest.onerror = (): void => {
        handleRequestError(clearRequest, reject, "deleting all data", storeName);
      };
    };

    openRequest.onerror = (): void => {
      handleRequestError(openRequest, reject, "opening db during deleteAllItems", storeName);
    };
  });
};

export const DBLib = {
  initDb,
  count,
  getItem,
  getAllItems,
  addItem,
  addMultipleItems,
  deleteItem,
  deleteAllItems,
  updateItem,
};
