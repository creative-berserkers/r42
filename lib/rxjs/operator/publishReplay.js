import { ReplaySubject } from '../ReplaySubject';
import { multicast } from './multicast';
/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {ConnectableObservable<T>}
 * @method publishReplay
 * @owner Observable
 */
export function publishReplay(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    return multicast.call(this, new ReplaySubject(bufferSize, windowTime, scheduler));
}
//# sourceMappingURL=publishReplay.js.map