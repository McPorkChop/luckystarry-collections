import { IEnumerable, Enumerable } from '../enumerable'
import * as utils from '../utils'

export function where<TSource>(
  source: Iterable<TSource>,
  predicate: (item: TSource, index?: number) => boolean
): IEnumerable<TSource> {
  utils.throws.ThrowIfNull('source', source)
  utils.throws.ThrowIfNull('predicate', predicate)
  return Enumerable.AsEnumerable(filter(source, predicate))
}

function* filter<TSource>(
  source: Iterable<TSource>,
  predicate: (item: TSource, index?: number) => boolean
): Iterable<TSource> {
  let index = 0
  for (let item of source) {
    if (predicate(item, index++)) {
      yield item
    }
  }
}
