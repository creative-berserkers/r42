import { Subject } from '../Subject';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that emits the same values as the source observable with the exception of an `error`.
 * An `error` will cause the emission of the Throwable that cause the error to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `error` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/retryWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @return {Observable} the source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
export function retryWhen(notifier) {
    return this.lift(new RetryWhenOperator(notifier, this));
}
class RetryWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RetryWhenSubscriber extends OuterSubscriber {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            let errors = this.errors;
            let retries = this.retries;
            let retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject();
                retries = tryCatch(this.notifier)(errors);
                if (retries === errorObject) {
                    return super.error(errorObject.e);
                }
                retriesSubscription = subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this.unsubscribe();
            this.closed = false;
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    }
    _unsubscribe() {
        const { errors, retriesSubscription } = this;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { errors, retries, retriesSubscription } = this;
        this.errors = null;
        this.retries = null;
        this.retriesSubscription = null;
        this.unsubscribe();
        this.isStopped = false;
        this.closed = false;
        this.errors = errors;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        this.source.subscribe(this);
    }
}
//# sourceMappingURL=retryWhen.js.map