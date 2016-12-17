import { Subscriber } from '../Subscriber';
/**
 * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
 *
 * <img src="./img/isEmpty.png" width="100%">
 *
 * @return {Observable} an Observable that emits a Boolean.
 * @method isEmpty
 * @owner Observable
 */
export function isEmpty() {
    return this.lift(new IsEmptyOperator());
}
class IsEmptyOperator {
    call(observer, source) {
        return source._subscribe(new IsEmptySubscriber(observer));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IsEmptySubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    notifyComplete(isEmpty) {
        const destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    }
    _next(value) {
        this.notifyComplete(false);
    }
    _complete() {
        this.notifyComplete(true);
    }
}
//# sourceMappingURL=isEmpty.js.map