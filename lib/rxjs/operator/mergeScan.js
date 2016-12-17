import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
/**
 * @param project
 * @param seed
 * @param concurrent
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method mergeScan
 * @owner Observable
 */
export function mergeScan(project, seed, concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeScanOperator(project, seed, concurrent));
}
export class MergeScanOperator {
    constructor(project, seed, concurrent) {
        this.project = project;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    call(subscriber, source) {
        return source._subscribe(new MergeScanSubscriber(subscriber, this.project, this.seed, this.concurrent));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class MergeScanSubscriber extends OuterSubscriber {
    constructor(destination, project, acc, concurrent) {
        super(destination);
        this.project = project;
        this.acc = acc;
        this.concurrent = concurrent;
        this.hasValue = false;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            const index = this.index++;
            const ish = tryCatch(this.project)(this.acc, value);
            const destination = this.destination;
            if (ish === errorObject) {
                destination.error(errorObject.e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    _innerSub(ish, value, index) {
        this.add(subscribeToResult(this, ish, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { destination } = this;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=mergeScan.js.map