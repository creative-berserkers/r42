import { Subscriber } from '../Subscriber';
import { Notification } from '../Notification';
/**
 * @see {@link Notification}
 *
 * @param scheduler
 * @param delay
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method observeOn
 * @owner Observable
 */
export function observeOn(scheduler, delay = 0) {
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
export class ObserveOnOperator {
    constructor(scheduler, delay = 0) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return source._subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class ObserveOnSubscriber extends Subscriber {
    constructor(destination, scheduler, delay = 0) {
        super(destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    static dispatch(arg) {
        const { notification, destination } = arg;
        notification.observe(destination);
    }
    scheduleMessage(notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    }
    _next(value) {
        this.scheduleMessage(Notification.createNext(value));
    }
    _error(err) {
        this.scheduleMessage(Notification.createError(err));
    }
    _complete() {
        this.scheduleMessage(Notification.createComplete());
    }
}
export class ObserveOnMessage {
    constructor(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
}
//# sourceMappingURL=observeOn.js.map