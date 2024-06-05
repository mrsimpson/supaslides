import { upsertObjectInArray } from './array'
import { describe, expect, it } from 'vitest'

describe('upsertObjectInArray', () => {
  it('updates an object in the array with the same id as the provided object', () => {
    const arr = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
    const obj = { id: 1, name: 'Bob' }
    expect(upsertObjectInArray(arr, obj, 'id')).toEqual([
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Jane' }
    ])
  })

  it('updates an object in the array with the same name as the provided object', () => {
    const arr = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
    const obj = { id: 4711, name: 'John' }
    expect(upsertObjectInArray(arr, obj, 'name')).toEqual([
      { id: 4711, name: 'John' },
      { id: 2, name: 'Jane' }
    ])
  })

  it('appends the item to the array if the object is not found', () => {
    const arr = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
    const obj = { id: 3, name: 'Bob' }
    expect(upsertObjectInArray(arr, obj, 'id')).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' }
    ])
  })

  it('should not mutate the original array', () => {
    const arr = [{ id: 1, name: 'John' }]
    const arrOriginal = JSON.parse(JSON.stringify(arr))
    const obj = { id: 1, name: 'Jane' }
    upsertObjectInArray(arr, obj, 'id')
    expect(arr).toEqual(arrOriginal)
  })
})
