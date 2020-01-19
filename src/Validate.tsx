import React from "react";
import {Contradictions, Groupings, SquareAddress, Values} from "./Types";

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

function checkGroup(values: Values, addresses: SquareAddress[]): Contradictions {
    if (addresses.length !== 9) {
        throw new Error("address length is no 9!");
    }
    const contradictions: Contradictions = new Set();
    for (let i = 0; i < 9; i++) {
        const address1 = addresses[i];
        const num1 = values.get(address1);
        if (num1 !== undefined) {
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

/**
 * Combines the collection of Contradictions from each group in groupings. All
 * SquareAddresses in a group corresponding to the same SquareValues are returned in
 * the Set Contradictions.
 * @param values {Values} A Map of square addresses of each Square in the sudoku
 *        board to their corresponding SquareValue.
 * @param groupings {Groupings} A double array of groupings of Squares. Each
 *        grouping is supposed to correspond to unique SquareValue.
 */
export function checkGroupings(values: Values, groupings: Groupings): Contradictions {
    return groupings
        .map( (group) => {
        return checkGroup(values, group);
        })
        .reduce((allContradictions, thisContradiction) => {
        return new Set([...allContradictions, ...thisContradiction]);
        },
        new Set<SquareAddress>());
}

/**
 * Returns all contradictions of a normal sudoku board.
 * @param values {Values} A Map of square addresses of each Square in the sudoku
 *        board to their corresponding SquareValue.
 * @param grouping {Groupings} A double array of groupings of Squares. Each
 *        grouping is supposed to correspond to unique SquareValue.
 */
export function normalSudokuValidator(values: Values, grouping: Groupings): Contradictions {
    return checkGroupings(values, [...ROWS, ...COLUMNS, ...grouping]);
    /*const rowCheck = checkGroup(values, ROWS);
    const colCheck = checkGroup(values, COLUMNS);
    const groupCheck = checkGroup(values, grouping);
    return new Set([...rowCheck, ...colCheck, ...groupCheck]);*/
}
