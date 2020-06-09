import {SquareValue} from "./Types";
import {Contradictions, Groupings, SquareAddress, Values} from "./Types";
import * as Validate from "./Validate";

describe("test checkGroupings", () => {
    test("with empty Values map", () => {
        const val: Values = new Map<SquareAddress, SquareValue>();
        const group: Groupings = [[0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8]];
        const set = Validate.checkGroupings(val, group);
        expect(set).toEqual(new Set<SquareAddress>());
    });
    describe("with one group in groupings", () => {
        const noContradiction = new Set<SquareAddress>();
        const group: Groupings = [[0, 1, 2, 3, 4, 5, 6, 7, 8]];

        test("with 1 values and 0 contradictions", () => {
            const val1: Values = new Map<SquareAddress, SquareValue>();
            val1.set(0, 1);
            const set1 = Validate.checkGroupings(val1, group);
            expect(set1).toEqual(noContradiction);
        });

        test("with 4 values and 0 contradictions", () => {
            const val2: Values = new Map<SquareAddress, SquareValue>();
            val2.set(0, 1);
            val2.set(1, 2);
            val2.set(2, 3);
            val2.set(3, 4);
            const set2 = Validate.checkGroupings(val2, group);
            expect(set2).toEqual(noContradiction);
        });

        test("with 4 values and 2 contradictions", () => {
            const val3: Values = new Map<SquareAddress, SquareValue>();
            val3.set(0, 1);
            val3.set(1, 1);
            val3.set(2, 2);
            val3.set(3, 3);
            const set3 = Validate.checkGroupings(val3, group);
            const set3E = new Set<SquareAddress>();
            set3E.add(0);
            set3E.add(1);
            expect(set3).toEqual(set3E);
        });

        test("with 4 values and 4 contradictions", () => {
            const val4: Values = new Map<SquareAddress, SquareValue>();
            val4.set(0, 1);
            val4.set(1, 1);
            val4.set(2, 2);
            val4.set(3, 2);
            const set4 = Validate.checkGroupings(val4, group);
            const set4E = new Set<SquareAddress>();
            set4E.add(0);
            set4E.add(1);
            set4E.add(2);
            set4E.add(3);
            expect(set4).toEqual(set4E);
        });
    });
});

/*
// Not deterministic but maintained for future reference.
function addToVal(toContradict: boolean, values: Values, groupings: Groupings): Contradictions {
    const randomGroup = groupings[Math.floor(Math.random() * groupings.length)];
    const randomElement = randomGroup[Math.floor(Math.random() * randomGroup.length)];
    const contradictions: Contradictions = new Set<SquareAddress>();
    if (toContradict) {
        for (const elementToAdd of randomGroup) {
            const val = values.has(randomElement) ?
                values.get(randomElement) as SquareValue :
                Math.floor(Math.random() * 9) + 1 as SquareValue;
            if (!values.has(elementToAdd)) {
                values.set(elementToAdd, val);
                values.set(randomElement, val);
                contradictions.add(elementToAdd);
                contradictions.add(randomElement);
                for (const otherElement of randomGroup) {
                    if (otherElement !== elementToAdd &&
                        otherElement !== randomElement &&
                        values.get(otherElement) === val) {
                        contradictions.add(otherElement);
                    }
                }
            }
        }
    } else {
        let randomFreeValue = null;
        for (let i = 0; i < 100; i++) {
            let num = Math.floor(Math.random() * 9) + 1;
            for (const element of randomGroup) {
                if (values.get(element) === num) {
                    num = -1;
                    break;
                }
            }
            if (num > 0) {
                randomFreeValue = num;
                break;
            }
        }
        if (randomFreeValue === null) {
            return contradictions;
        }
        for (const elementToAdd of randomGroup) {
            if (!values.has(elementToAdd)) {
                values.set(elementToAdd, randomFreeValue as SquareValue);
                break;
            }
        }
    }
    return contradictions;
}

function randomTestCheckGroup(numOfAddToVal: number, group: Groupings) {
    const val: Values = new Map<SquareAddress, SquareValue>();
    let expSet: Contradictions = new Set<SquareAddress>();
    for (let i = 0; i < numOfAddToVal; i++) {
        const toContradict = Math.floor(Math.random() * 2) === 1;
        const newSet = addToVal(toContradict, val, group);
        expSet = new Set<SquareAddress>([...expSet, ...newSet]);
    }

    const set = Validate.checkGroupings(val, group);
    expect(set).toEqual(expSet);
}

test("checkGroup test 3 - random", () => {
    const size = 100;
    const numOfAddToValMAX = 40;
    const group: Groupings =
        [
            [0, 1, 2, 9, 10, 11, 18, 19, 20],
            [3, 4, 5, 12, 13, 14, 21, 22, 23],
            [6, 7, 8, 15, 16, 17, 24, 25, 26],
            [27, 28, 29, 36, 37, 38, 45, 46, 47],
            [30, 31, 32, 39, 40, 41, 48, 49, 50],
            [33, 34, 35, 42, 43, 44, 51, 52, 53],
            [54, 55, 56, 63, 64, 65, 72, 73, 74],
            [57, 58, 59, 66, 67, 68, 75, 76, 77],
            [60, 61, 62, 69, 70, 71, 78, 79, 80],
        ];
    for (let i = 0; i < size; i++) {
        const num = Math.floor(Math.random() * numOfAddToValMAX);
        randomTestCheckGroup(num, group);
    }
});
*/
