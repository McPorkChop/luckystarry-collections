import { IEnumerable, Enumerable } from '../enumerable'
import { IEqualityComparer, EqualityComparer } from '../equality-comparer'
import { IGrouping } from '../grouping'
import * as utils from '../utils'

export function join<
  TOuter,
  TInner,
  TKey,
  TResult = { Outer: TOuter; Inner: TInner }
>(
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector?: (item: TOuter, inners: TInner) => TResult,
  comparer?: IEqualityComparer<TKey>
): IEnumerable<TResult> {
  utils.throws.ThrowIfNull('outer', outer)
  utils.throws.ThrowIfNull('inner', inner)
  utils.throws.ThrowIfNull('outerKeySelector', outerKeySelector)
  utils.throws.ThrowIfNull('innerKeySelector', innerKeySelector)
  let _resultSelector: any =
    resultSelector ||
    ((o, i) => {
      return { Outer: o, Inner: i }
    })
  comparer = comparer || EqualityComparer.Default()
  let outerKeys = Enumerable.ToList(
    Enumerable.Select(outer, item => outerKeySelector(item))
  )
  let groupedInner = Enumerable.ToList(
    Enumerable.GroupBy(
      Enumerable.Where(inner, item =>
        Enumerable.Contains(outerKeys, innerKeySelector(item), comparer)
      ),
      item => innerKeySelector(item),
      g => g,
      comparer
    )
  )
  return Enumerable.AsEnumerable(
    process<TOuter, TInner, TKey, TResult>(
      outer,
      outerKeySelector,
      groupedInner,
      _resultSelector,
      comparer
    )
  )
}

function* process<TOuter, TInner, TKey, TResult>(
  outer: Iterable<TOuter>,
  outerKeySelector: (item: TOuter) => TKey,
  groupedInner: Iterable<IGrouping<TKey, TInner>>,
  resultSelector: (item: TOuter, inners: TInner) => TResult,
  comparer?: IEqualityComparer<TKey>
) {
  for (let item of outer) {
    let key = outerKeySelector(item)
    let inners: IEnumerable<TInner> = Enumerable.FirstOrDefault(
      groupedInner,
      null,
      g => comparer.Equals(g.Key, key)
    )
    if (inners && Enumerable.Any(inners)) {
      for (let inner of inners) {
        yield resultSelector(item, inner)
      }
    }
  }
}
