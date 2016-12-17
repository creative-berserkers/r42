import { Subscriber } from '../Subscriber';
/**
 * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
 * @method toArray
 * @owner Observable
 */
export function toArray() {
    return this.lift(new ToArrayOperator());
}
class ToArrayOperator {
    call(subscriber, source) {
        return source._subscribe(new ToArraySubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ToArraySubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
        this.array = [];
    }
    _next(x) {
        this.array.push(x);
    }
    _complete() {
        this.destination.next(this.array);
        this.destination.complete();
    }
}
//# sourceMappingURL=toArray.js.map