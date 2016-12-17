import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
export function distinct(compare, flushes) {
    return this.lift(new DistinctOperator(compare, flushes));
}
class DistinctOperator {
    constructor(compare, flushes) {
        this.compare = compare;
        this.flushes = flushes;
    }
    call(subscriber, source) {
        return source._subscribe(new DistinctSubscriber(subscriber, this.compare, this.flushes));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class DistinctSubscriber extends OuterSubscriber {
    constructor(destination, compare, flushes) {
        super(destination);
        this.values = [];
        if (typeof compare === 'function') {
            this.compare = compare;
        }
        if (flushes) {
            this.add(subscribeToResult(this, flushes));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.length = 0;
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    _next(value) {
        let found = false;
        const values = this.values;
        const len = values.length;
        try {
            for (let i = 0; i < len; i++) {
                if (this.compare(values[i], value)) {
                    found = true;
                    return;
                }
            }
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.values.push(value);
        this.destination.next(value);
    }
    compare(x, y) {
        return x === y;
    }
}
//# sourceMappingURL=distinct.js.map