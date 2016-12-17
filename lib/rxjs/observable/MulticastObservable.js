import { Observable } from '../Observable';
import { ConnectableObservable } from '../observable/ConnectableObservable';
export class MulticastObservable extends Observable {
    constructor(source, subjectFactory, selector) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    _subscribe(subscriber) {
        const { selector, source } = this;
        const connectable = new ConnectableObservable(source, this.subjectFactory);
        const subscription = selector(connectable).subscribe(subscriber);
        subscription.add(connectable.connect());
        return subscription;
    }
}
//# sourceMappingURL=MulticastObservable.js.map