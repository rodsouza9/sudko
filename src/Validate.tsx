import React, {KeyboardEvent, RefObject} from "react";
import {Contradictions, Groupings, SquareAddress, SquareValue, Values} from "./App";

// tslint:disable-next-line:no-var-requires
const _ = require("lodash");

export type Contradicts = boolean;

 /*
 * Contradictions should only contain contradicting mappings
 */

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

function checkNineArr(values: Values, addresses: SquareAddress[]): Contradictions {
    if (addresses.length !== 9) {
        throw new Error("address length is no 9!");
    }
    const contradictions: Contradictions = new Set();
    for (let i = 0; i < 9; i++) {
        const address1 = addresses[i];
        const num1 = values.get(address1);
        if (num1 !== undefined) {
            //throw new Error("address " + address1 + " does not exist in map");
            for (let j = i + 1; j < addresses.length; j++) {
                const address2 = addresses[j];
                const num2 = values.get(address2);
                if (num1 === num2) {
                    contradictions.add(address1);
                    contradictions.add(address2);
                }
            }
        }
    }
    return contradictions;
}

function normalRowCheck(values: Values): Contradictions {
    let contradictions: Contradictions = new Set<SquareAddress>();
    for (const row of ROWS) {
        const otherContradictions = checkNineArr(values, row);
        contradictions = new Set([...contradictions, ...otherContradictions]);
    }
    return contradictions;
}

function normalColumnCheck(values: Values): Contradictions {
    let contradictions: Contradictions = new Set<SquareAddress>();
    for (const col of COLUMNS) {
        const otherContradictions = checkNineArr(values, col);
        contradictions = new Set([...contradictions, ...otherContradictions]);
    }
    return contradictions;
}

function normalGroupCheck(values: Values, grouping: Groupings): Contradictions {
    let contradictions: Contradictions = new Set<SquareAddress>();
    for (const group of grouping) {
        const otherContradictions = checkNineArr(values, group);
        contradictions = new Set([...contradictions, ...otherContradictions]);
    }
    return contradictions;
}

export function normalCheck(values: Values, grouping: Groupings): Contradictions {
    const rowCheck = normalRowCheck(values);
    const colCheck = normalColumnCheck(values);
    const groupCheck = normalGroupCheck(values, grouping);
    return new Set([...rowCheck, ...colCheck, ...groupCheck]);
}
