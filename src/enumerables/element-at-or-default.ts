import { IEnumerable } from '../enumerable'
import * as utils from '../utils'

export function elementAtOrDefault<TSource>(
  source: IEnumerable<TSource>,
  defaultValue: TSource,
  index: number
) {
  utils.throws.ThrowIfNull('source', source)
  if (index < 0) {
    return defaultValue
  }
  let i = 0
  for (let item of source) {
    if (i === index) {
      return item
    }
    i++
  }
  return defaultValue
}
