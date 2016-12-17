import { SubscribeOnObservable } from '../observable/SubscribeOnObservable';
/**
 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} the Scheduler to perform subscription actions on.
 * @return {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
 .
 * @method subscribeOn
 * @owner Observable
 */
export function subscribeOn(scheduler, delay = 0) {
    return new SubscribeOnObservable(this, delay, scheduler);
}
//# sourceMappingURL=subscribeOn.js.map