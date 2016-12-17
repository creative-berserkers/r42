import { Subscriber } from '../Subscriber';
import { async } from '../scheduler/async';
/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
export function timestamp(scheduler = async) {
    return this.lift(new TimestampOperator(scheduler));
}
export class Timestamp {
    constructor(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
}
;
class TimestampOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer, source) {
        return source._subscribe(new TimestampSubscriber(observer, this.scheduler));
    }
}
class TimestampSubscriber extends Subscriber {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
    }
    _next(value) {
        const now = this.scheduler.now();
        this.destination.next(new Timestamp(value, now));
    }
}
//# sourceMappingURL=timestamp.js.map