import { Subject } from '../Subject';
import { async } from '../scheduler/async';
import { Subscriber } from '../Subscriber';
/**
 * Branch out the source Observable values as a nested Observable periodically
 * in time.
 *
 * <span class="informal">It's like {@link bufferTime}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowTime.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable starts a new window periodically, as
 * determined by the `windowCreationInterval` argument. It emits each window
 * after a fixed timespan, specified by the `windowTimeSpan` argument. When the
 * source Observable completes or encounters an error, the output Observable
 * emits the current window and propagates the notification from the source
 * Observable. If `windowCreationInterval` is not provided, the output
 * Observable starts a new window when the previous window of duration
 * `windowTimeSpan` completes.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds start a window 1 second long, and emit at most 2 click events per window</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000, 5000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferTime}
 *
 * @param {number} windowTimeSpan The amount of time to fill each window.
 * @param {number} [windowCreationInterval] The interval at which to start new
 * windows.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine window boundaries.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowTime
 * @owner Observable
 */
export function windowTime(windowTimeSpan, windowCreationInterval = null, scheduler = async) {
    return this.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler));
}
class WindowTimeOperator {
    constructor(windowTimeSpan, windowCreationInterval, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowTimeSubscriber extends Subscriber {
    constructor(destination, windowTimeSpan, windowCreationInterval, scheduler) {
        super(destination);
        this.destination = destination;
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
        this.windows = [];
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            let window = this.openWindow();
            const closeState = { subscriber: this, window, context: null };
            const creationState = { windowTimeSpan, windowCreationInterval, subscriber: this, scheduler };
            this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            let window = this.openWindow();
            const timeSpanOnlyState = { subscriber: this, window, windowTimeSpan };
            this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
    }
    _next(value) {
        const windows = this.windows;
        const len = windows.length;
        for (let i = 0; i < len; i++) {
            const window = windows[i];
            if (!window.closed) {
                window.next(value);
            }
        }
    }
    _error(err) {
        const windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    }
    _complete() {
        const windows = this.windows;
        while (windows.length > 0) {
            const window = windows.shift();
            if (!window.closed) {
                window.complete();
            }
        }
        this.destination.complete();
    }
    openWindow() {
        const window = new Subject();
        this.windows.push(window);
        const destination = this.destination;
        destination.next(window);
        return window;
    }
    closeWindow(window) {
        window.complete();
        const windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    }
}
function dispatchWindowTimeSpanOnly(state) {
    const { subscriber, windowTimeSpan, window } = state;
    if (window) {
        window.complete();
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    let { windowTimeSpan, subscriber, scheduler, windowCreationInterval } = state;
    let window = subscriber.openWindow();
    let action = this;
    let context = { action, subscription: null };
    const timeSpanState = { subscriber, window, context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(arg) {
    const { subscriber, window, context } = arg;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}
//# sourceMappingURL=windowTime.js.map