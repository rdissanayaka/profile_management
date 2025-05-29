let db = null

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserProfileDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      db = event.target.result

      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "userId" })
      }
    }
  })
}

export const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readwrite")
    const store = transaction.objectStore("users")
    const request = store.put(user)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export const getUser = (userId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    const request = store.get(userId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["users"], "readwrite")
    const store = transaction.objectStore("users")
    const request = store.delete(userId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
