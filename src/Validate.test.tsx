import App, {SquareValue} from "./App";
import {Contradictions, Groupings, SquareAddress, Values} from "./Types";
import * as Validate from "./Validate";

const ROWS =   [[0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8],
    [9 , 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80]];

const COLUMNS = [[0, 9 , 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80]];

test("test of tests", () => {
    expect(1 + 2).toBe(3);
});

test("checkGroup test 1 - empty Values", () => {
    const val: Values = new Map<SquareAddress, SquareValue>();
    const group: Groupings = [[0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8]];
    const set = Validate.checkGroupings(val, group);
    expect(set).toEqual(new Set<SquareAddress>());
});

test("checkGroup test 2.0 - single group", () => {
    const val1: Values = new Map<SquareAddress, SquareValue>();
    val1.set(0, 1);
    const group1: Groupings = [[0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8]];
    const set1 = Validate.checkGroupings(val1, group1);
    expect(set1).toEqual(new Set<SquareAddress>());

    const val2: Values = new Map<SquareAddress, SquareValue>();
    val2.set(0, 1); val2.set(1, 2); val2.set(2, 3); val2.set(3, 4);
    const set2 = Validate.checkGroupings(val2, group1);
    expect(set2).toEqual(new Set<SquareAddress>());

    const val3: Values = new Map<SquareAddress, SquareValue>();
    val3.set(0, 1); val3.set(1, 1); val3.set(2, 2); val3.set(3, 3);
    const set3 = Validate.checkGroupings(val3, group1);
    const set3E = new Set<SquareAddress>();
    set3E.add(0); set3E.add(1);
    expect(set3).toEqual(set3E);

    const val4: Values = new Map<SquareAddress, SquareValue>();
    val4.set(0, 1); val4.set(1, 1); val4.set(2, 2); val4.set(3, 2);
    const set4 = Validate.checkGroupings(val4, group1);
    const set4E = new Set<SquareAddress>();
    set4E.add(0); set4E.add(1); set4E.add(2); set4E.add(3);
    expect(set4).toEqual(set4E);
});

// not entirely random but somewhat random
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
