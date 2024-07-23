export function findIndexByAttribute<
  T extends {
    [k: string]: any
  },
  K extends keyof T
>(arr: T[], attributeName: K, value: T): number {
  return arr.findIndex((item) => item[attributeName] === value[attributeName])
}

export function upsertObjectInArray<
  T extends {
    [k: string]: any
  },
  K extends keyof T
>(arr: T[], obj: T, attributeName: K): T[] {
  const index = findIndexByAttribute(arr, attributeName, obj)
  if (index >= 0) {
    return [...arr.slice(0, index), obj, ...arr.slice(index + 1)]
  } else {
    return [...arr, obj]
  }
}
