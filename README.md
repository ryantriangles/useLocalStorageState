# useLocalStorageState

React hook that behaves like `useState`, but caches values in local storage to
make state persistent between sessions and, with the aid of storage events,
keep state in sync between tabs and windows.