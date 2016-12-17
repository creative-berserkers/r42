import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback function to be called when source terminates.
 * @return {Observable} an Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
export function _finally(callback) {
    return this.lift(new FinallyOperator(callback));
}
class FinallyOperator {
    constructor(callback) {
        this.callback = callback;
    }
    call(subscriber, source) {
        return source._subscribe(new FinallySubscriber(subscriber, this.callback));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class FinallySubscriber extends Subscriber {
    constructor(destination, callback) {
        super(destination);
        this.add(new Subscription(callback));
    }
}
//# sourceMappingURL=finally.js.map