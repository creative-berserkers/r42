import { Observable } from '../Observable';
import { ReplaySubject } from '../ReplaySubject';
/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {Observable<any>}
 * @method cache
 * @owner Observable
 */
export function cache(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    let subject;
    let source = this;
    let refs = 0;
    let outerSub;
    const getSubject = () => {
        subject = new ReplaySubject(bufferSize, windowTime, scheduler);
        return subject;
    };
    return new Observable((observer) => {
        if (!subject) {
            subject = getSubject();
            outerSub = source.subscribe((value) => subject.next(value), (err) => {
                let s = subject;
                subject = null;
                s.error(err);
            }, () => subject.complete());
        }
        refs++;
        if (!subject) {
            subject = getSubject();
        }
        let innerSub = subject.subscribe(observer);
        return () => {
            refs--;
            if (innerSub) {
                innerSub.unsubscribe();
            }
            if (refs === 0) {
                outerSub.unsubscribe();
            }
        };
    });
}
//# sourceMappingURL=cache.js.map