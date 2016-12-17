import { FromObservable } from '../observable/FromObservable';
import { isArray } from '../util/isArray';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export function onErrorResumeNext(...nextSources) {
    if (nextSources.length === 1 && isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return this.lift(new OnErrorResumeNextOperator(nextSources));
}
/* tslint:enable:max-line-length */
export function onErrorResumeNextStatic(...nextSources) {
    let source = null;
    if (nextSources.length === 1 && isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return new FromObservable(source, null).lift(new OnErrorResumeNextOperator(nextSources));
}
class OnErrorResumeNextOperator {
    constructor(nextSources) {
        this.nextSources = nextSources;
    }
    call(subscriber, source) {
        return source._subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    }
}
class OnErrorResumeNextSubscriber extends OuterSubscriber {
    constructor(destination, nextSources) {
        super(destination);
        this.destination = destination;
        this.nextSources = nextSources;
    }
    notifyError(error, innerSub) {
        this.subscribeToNextSource();
    }
    notifyComplete(innerSub) {
        this.subscribeToNextSource();
    }
    _error(err) {
        this.subscribeToNextSource();
    }
    _complete() {
        this.subscribeToNextSource();
    }
    subscribeToNextSource() {
        const next = this.nextSources.shift();
        if (next) {
            this.add(subscribeToResult(this, next));
        }
        else {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=onErrorResumeNext.js.map