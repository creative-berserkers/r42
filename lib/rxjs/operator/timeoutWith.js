import { async } from '../scheduler/async';
import { isDate } from '../util/isDate';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * @param due
 * @param withObservable
 * @param scheduler
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method timeoutWith
 * @owner Observable
 */
export function timeoutWith(due, withObservable, scheduler = async) {
    let absoluteTimeout = isDate(due);
    let waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
}
class TimeoutWithOperator {
    constructor(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeoutWithSubscriber extends OuterSubscriber {
    constructor(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        super();
        this.destination = destination;
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.timeoutSubscription = undefined;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        destination.add(this);
        this.scheduleTimeout();
    }
    get previousIndex() {
        return this._previousIndex;
    }
    get hasCompleted() {
        return this._hasCompleted;
    }
    static dispatchTimeout(state) {
        const source = state.subscriber;
        const currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.handleTimeout();
        }
    }
    scheduleTimeout() {
        let currentIndex = this.index;
        const timeoutState = { subscriber: this, index: currentIndex };
        this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
        this.index++;
        this._previousIndex = currentIndex;
    }
    _next(value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    }
    _error(err) {
        this.destination.error(err);
        this._hasCompleted = true;
    }
    _complete() {
        this.destination.complete();
        this._hasCompleted = true;
    }
    handleTimeout() {
        if (!this.closed) {
            const withObservable = this.withObservable;
            this.unsubscribe();
            this.destination.add(this.timeoutSubscription = subscribeToResult(this, withObservable));
        }
    }
}
//# sourceMappingURL=timeoutWith.js.map