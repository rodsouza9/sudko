import Button, {ButtonProps} from "@material-ui/core/Button";
import * as _ from "lodash";
import React, {KeyboardEvent, RefObject, SyntheticEvent} from "react";
import "./App.css";
import * as Validate from "./Types";

const KEY_DELETE = 8;
const KEY_TAB = 9;
const KEY_COMMAND = 91;
const KEY_1 = 49;
const KEY_9 = 57;

const App: React.FC = () => {

    const vals =
        [null, 3, 1, 6, 7, null, 4, null, 9,
            null, null, null, 8, 3, null, null, null, null,
            8, 2, null, null, null, null, null, 1, null,
            null, 7, 4, null, null, 8, 1, 6, null,
            null, 8, null, null, 6, null, null, null, 4,
            9, null, 2, null, null, null, null, 7, 3,
            4, 9, null, null, 5, 7, 2, 3, null,
            2, null, null, null, 9, null, 5, null, 7,
            7, null, 3, 2, null, null, 6, null, 1] as Array<SquareValue | null>;

    const groups =
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

    const basicVals =
        [0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44,
            45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62,
            63, 64, 65, 66, 67, 68, 69, 70, 71,
            72, 73, 74, 75, 76, 77, 78, 79, 80] as Array<SquareValue | null>;

    return (
        <div className="App">
            <header className="App-header">
                <Board
                    permanentValues={vals}
                    groupings={groups}
                />
            </header>
        </div>
    );
};

/**
 * @type {number} SquareAddress
 *      A number ranging between 0 and 80 which represents a Square's position in
 *      the sudoku board.
 */
export type SquareAddress = number;

/**
 * @type {1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9} SquareValue
 *      A number ranging between 0 and 9 which represents the value of a Square
 *      in the sudoku board.
 */
export type SquareValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ;

/**
 * @type {"normal" | "corner"} NumberMode
 *      Determines whether the number buttons will fill in a Square's value or
 *      its corner marking.
 */
export type NumberMode = "normal" | "corner";

/**
 * @type {Map<SquareAddress, SquareValue>} Values
 *      A mapping of each Square Component's SquareAddress to its corresponding
 *      value.
 */
export type Values = Map<SquareAddress, SquareValue>;

/**
 * @type {SquareAddress[][]} Groupings
 *      List of groupings of Squares. Each grouping determines which elements are
 *      in each box in the sudoku board.
 */
export type Groupings = SquareAddress[][];

/**
 * @type {Set<SquareAddress>} Contradictions
 *      A set of square addresses corresponding to the Square's which contradict
 *      with each other. A contradiction occurs when two squares with the same
 *      value appear in the same row, column, or group.
 */
export type Contradictions = Set<SquareAddress>;

/**
 * @interface shape of Board.state
 *
 * @property {Set<SquareAddress>} contradicts
 *      Updated when check buttons is clicked. All seemingly incorrect squares
 *      are added to Board.state.contradicts and are colored accordingly.
 * @property {boolean} highlighting
 *      True when mouse is held down over Square components. Determines whether
 *      to add Squares hovered over to Board.state.highlights.
 * @property {Instance} instance
 *      Double linked list that enables history management such as undo and redo
 *      functionality.
 * @property {Set<SquareAddress>} mouseOverHighlighting
 *      Set of currently selected Square components, are all colored accordingly.
 * @property {boolean} multiStrokeHighlighting
 *      True when Command Key is pressed.
 * @property {NumberMode} numpadMode
 *      Can either be in "normal" or "corner" mode. Determines whether the numpad
 *      buttons add a marking or a value to the Square Component.
 */
interface BoardState {
    contradicts: Contradictions;
    highlights: Set<SquareAddress>;
    instance: Instance;
    mouseOverHighlighting: boolean;
    multiStrokeHighlighting: boolean;
    numpadMode: NumberMode;
}

/**
 * @interface shape of Board.props
 *
 * @property {Array<SquareValue | null>} permanentValues
 *      Array of size 81 of initial values for sudoku board. Elements are null if
 *      they are not a permanent values
 * @property {Groupings} groupings
 *      List of groupings of Squares. Each grouping determines which elements are
 *      in each box in the sudoku board.
 */
interface BoardProps {
    permanentValues: Array<SquareValue | null>;
    groupings: Groupings;
}

/**
 * @interface Doubly linked list that enables history management such as undo and
 *      redo functionality.
 *      @child {Instance | null} previousInstance
 *          A reference to the previous Instance. Used in undo functionality.
 *      @child {Map<SquareAddress, Set<SquareValue>>} markingMap
 *          A mapping of each Square Component's SquareAddress to its
 *          corresponding Set of markings. The contents of the Set of markings
 *          are accordingly rendered in the correct positions.
 *      @child {Map<SquareAddress, SquareValue>} values
 *          A mapping of each Square Component's SquareAddress to its
 *          corresponding value.
 *      @child {Instance | null} nextInstance
 *          A reference to the next Instance, only exist after undo and before a
 *          new update is made. Used in redo functionality.
 */
interface Instance {
    previousInstance: Instance | null;
    markingMap: Map<SquareAddress, Set<SquareValue>>;
    values: Values;
    nextInstance: Instance | null;
}

class Board extends React.Component<BoardProps, BoardState> {
    public state: BoardState = {
        contradicts: new Set(),
        highlights: new Set(),
        instance: {
            markingMap: new Map(),
            nextInstance: null,
            previousInstance: null,
            values: new Map(),
        },
        mouseOverHighlighting: false,
        multiStrokeHighlighting: false,
        numpadMode: "normal",
    };

    private screenRef: RefObject<HTMLDivElement>;

    constructor(props: BoardProps) {
        super(props);
        this.screenRef = React.createRef<HTMLDivElement>();
    }

    public componentDidMount() {
        if (this.screenRef.current !== null) {
            this.screenRef.current.focus();
        }
    }

    public consolidateAllValues(): Values {
        const map: Values = new Map();
        for (let i = 0; i < 81; i++) {
            if (this.isPermanent(i)) {
                map.set(i, this.props.permanentValues[i] as SquareValue);
            } else {
                map.set(i, this.state.instance.values.get(i) as SquareValue);
            }
        }
        return map;
    }

    public updateContradictions() {
        const allValues = this.consolidateAllValues();
        const newContradictions = Validate.normalSudokuValidator(allValues, this.props.groupings);
        const newState = _.cloneDeep(this.state);
        newState.contradicts = newContradictions;
        this.setState(newState, this.contradictionAlert);
    }

    public contradictionAlert() {
        if (this.state.contradicts.size > 0) {
            alert("Sorry :/ There are some errors.");
        } else if (this.isFilled()) {
            alert("C O N G R A D U L A T I O N S ! ! !");
        } else {
            alert("No errors! Keep going!");
        }
    }

    public isFilled(): boolean {
        for (let i = 0; i < 81; i++) {
            if (!this.isPermanent(i) && !this.state.instance.values.has(i)) {
                return false;
            }
        }
        return true;
    }

    public toggleNumpadMode() {
        const newState = _.cloneDeep(this.state);
        newState.numpadMode = this.state.numpadMode === "normal" ? "corner" : "normal";
        this.setState(newState);
    }

    public isPermanent(i: SquareAddress): boolean {
        return this.props.permanentValues[i] != null; // True if in permanentValues[i] != null
    }

    public normalMarkSelectedSquares(i: SquareValue) {
        let newState = _.cloneDeep(this.state);
        for (const address of this.state.highlights) {
            if (!this.isPermanent(address)) {
                newState.instance.values.set(address, i);
            }
        }
        newState = this.updateHistory(newState);
        this.setState(newState);
    }

    public cornerMarkSelectedSquares(i: SquareValue) {
        let newState = _.cloneDeep(this.state);
        for (const address of this.state.highlights) {
            if (this.isPermanent(address) || this.state.instance.values.has(address)) {
                continue;
            }
            const marks = newState.instance.markingMap.has(address) ?
                newState.instance.markingMap.get(address) as Set<SquareValue> :
                new Set() as Set<SquareValue>;
            if (marks.has(i)) {
                marks.delete(i);
            } else {
                marks.add(i);
            }
            newState.instance.markingMap.set(address, marks);
        }
        newState = this.updateHistory(newState);
        this.setState(newState);
    }

    /**
     * onClick for DELETE button
     */
    public deleteSelectedSquares(): void {
        let newState = _.cloneDeep(this.state);
        let deleteValues: boolean = false; // Determine weather to delete all values or delete all markings
        for (const address of this.state.highlights) {
            if (!this.isPermanent(address) && newState.instance.values.has(address)) {
                deleteValues = true;
                break;
            }
        }
        for (const address of this.state.highlights) {
            if (this.isPermanent(address)) {
                continue;
            }
            if (deleteValues) {
                newState.instance.values.delete(address);
            } else {
                newState.instance.markingMap.set(address, new Set());
            }
        }
        newState = this.updateHistory(newState);
        this.setState(newState);
    }

    /**
     * Deselect / unhighlight all highlighted squares.
     */
    public deselectSquares(): void {
        const newState = _.cloneDeep(this.state);
        newState.mouseOverHighlighting = false;
        newState.highlights = new Set<SquareAddress>();
        this.setState(newState);
    }

    /**
     * @function updateHistory({BoardState}): {BoardState}
     *      Is called when a change is made to markingMap or values. Creates
     *      a new Instance with the new markingMap and values. Handles basic
     *      linked list adding functionality. Sets newly created Instance
     *      as the Board.instance and sets it as state.
     * @param newState
     *      The BoardState with the changed markingMap or values.
     */
    public updateHistory(newState: BoardState): BoardState {
        const updatedHistoryState = _.cloneDeep(newState);
        const oldState = _.cloneDeep(this.state);
        const oldInstance = oldState.instance;
        const instanceToAdd: Instance = {
            markingMap: newState.instance.markingMap,
            nextInstance: null,
            previousInstance: oldInstance,
            values: newState.instance.values,
        };
        if (_.isEqual(instanceToAdd.values, oldInstance.values) &&
            _.isEqual(instanceToAdd.markingMap, oldInstance.markingMap)) {
            return updatedHistoryState;
        }
        oldState.instance.nextInstance = instanceToAdd;
        this.setState(oldState);
        updatedHistoryState.instance = instanceToAdd;
        return updatedHistoryState;
    }

    /**
     * Sets the Board.state.instance to the previous one in the linked list.
     */
    public undo(): void {
        const newState = _.cloneDeep(this.state);
        if (newState.instance.previousInstance === null) {
            return;
        }
        newState.instance = _.cloneDeep(newState.instance.previousInstance);
        this.setState(newState);
    }

    /**
     * Sets the Board.state.instance to the next one in the linked list.
     */
    public redo(): void {
        const newState = _.cloneDeep(this.state);
        if (newState.instance.nextInstance === null) {
            return;
        }
        newState.instance = _.cloneDeep(newState.instance.nextInstance);
        this.setState(newState);
    }

    /**
     * Sets Board.state to initial values. Used when restart button is clicked.
     */
    public restart(): void {
        const reset = window.confirm("Are you sure you would like to restart? All saved progress will be lost.");
        if (reset) {
            const newState: BoardState = {
                contradicts: new Set(),
                highlights: new Set(),
                instance: {
                    markingMap: new Map(),
                    nextInstance: null,
                    previousInstance: null,
                    values: new Map(),
                },
                mouseOverHighlighting: false,
                multiStrokeHighlighting: false,
                numpadMode: "normal",
            };
            this.setState(newState);
        }
    }

    public handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === KEY_DELETE) {
            e.preventDefault();
            this.deleteSelectedSquares();
            return;
        }
        if (e.keyCode === KEY_TAB) {
            e.preventDefault();
            this.toggleNumpadMode();
            return;
        }
        if (e.keyCode === KEY_COMMAND) { // Command Key
            e.preventDefault();
            const newState = _.cloneDeep(this.state);
            newState.multiStrokeHighlighting = true;
            this.setState(newState);
            return;
        }
        if (e.keyCode >= KEY_1 && e.keyCode <= KEY_9) {
            const i = (e.keyCode - KEY_1 + 1) as SquareValue;
            if (this.state.numpadMode === "normal") {
                this.normalMarkSelectedSquares(i);
            } else {
                this.cornerMarkSelectedSquares(i);
            }
        }
    }

    public handleGlobalKeyUp = (e: KeyboardEvent) => {
        if (e.keyCode === KEY_COMMAND) {
            const newState = _.cloneDeep(this.state);
            newState.multiStrokeHighlighting = false;
            this.setState(newState);
        }
    }

    public handleGlobalMouseDown = (e: MouseEvent) => {
        if (!e.defaultPrevented && !this.state.multiStrokeHighlighting) {
            e.preventDefault();
            this.deselectSquares();
        }
    }

    public handleGlobalMouseUp = (e: MouseEvent) => {
        if (!e.defaultPrevented) {
            e.preventDefault();
            const newState = _.cloneDeep(this.state);
            newState.mouseOverHighlighting = false;
            this.setState(newState);
        }
    }

    public handleSquareMouseDown = (i: SquareAddress) => (e: MouseEvent) => {
        e.preventDefault();
        const newState = _.cloneDeep(this.state);
        newState.mouseOverHighlighting = true;
        if (this.state.multiStrokeHighlighting) {
            newState.highlights.add(i);
        } else {
            newState.highlights = new Set([i]);
        }
        this.setState(newState);
    }

    public handleSquareMouseOver = (i: SquareAddress) => (e: MouseEvent) => {
        e.preventDefault();
        if (this.state.mouseOverHighlighting) {
            const newState = _.cloneDeep(this.state);
            newState.highlights.add(i);
            this.setState(newState);
        }
    }

    public handleSquareMouseUp = (i: SquareAddress) => (e: MouseEvent) => {
        e.preventDefault();
        const newState = _.cloneDeep(this.state);
        newState.mouseOverHighlighting = false;
        this.setState(newState);
    }

    public render() {
        return (
            <div
                className="screen"
                ref={this.screenRef}
                onKeyDown={this.handleGlobalKeyDown.bind(this)}
                onKeyUp={this.handleGlobalKeyUp.bind(this)}
                onMouseDown={(event) => {
                    this.handleGlobalMouseDown(event as unknown as MouseEvent);
                }}
                onMouseUp={(event) => {
                    this.handleGlobalMouseUp(event as unknown as MouseEvent);
                }}
                tabIndex={0}>
                <div className="game">
                    <div className="board">{this.renderSquares()}</div>
                    <div className="button-box">
                        <div className="button-box-top">
                            <ControlButtons
                                onClickMode={() => {
                                    this.toggleNumpadMode();
                                }}
                                onClickUndo={() => {
                                    this.undo();
                                }}
                                onClickRedo={() => {
                                    this.redo();
                                }}
                                numpadMode={this.state.numpadMode}
                            />
                            <Numpad
                                numpadMode={this.state.numpadMode}
                                onClickCorner={(i: SquareValue) => {
                                    this.cornerMarkSelectedSquares(i);
                                }}
                                onClickNormal={(i: SquareValue) => {
                                    this.normalMarkSelectedSquares(i);
                                }}
                                onClickDel={() => {
                                    this.deleteSelectedSquares();
                                }}
                            />
                        </div>
                        <div className="button-box-bot">
                            <EventPreventingButton
                                variant="contained"
                                color="primary"
                                onClick={() => {this.restart(); }}>
                                R E S T A R T
                            </EventPreventingButton>
                            <EventPreventingButton
                                variant="contained"
                                color="secondary"
                                onClick={() => {this.updateContradictions(); }}
                            >
                                C H E C K
                            </EventPreventingButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public renderSquares() {
        const list = [];
        for (const group of this.props.groupings) {
            const arr = [];
            for (const address of group) {
                arr.push(this.renderSquare(address));
            }
            list.push(<div className="group">{arr}</div>);
        }
        return list;
    }

    public renderSquare(i: SquareAddress) {
        const isHighlighted = this.state.highlights.has(i);
        const isContradicting = this.state.contradicts.has(i);
        const marks = this.state.instance.markingMap.has(i) ?
            this.state.instance.markingMap.get(i) as Set<SquareValue> :
            new Set() as Set<SquareValue>;
        return <Square
            value={this.isPermanent(i) ? this.props.permanentValues[i] :
                this.state.instance.values.has(i) ? this.state.instance.values.get(i) as SquareValue : null}
            isPermanent={this.isPermanent(i)}
            isHighlighted={isHighlighted}
            isContradicting={isContradicting}
            markings={marks}
            onMouseDown={this.handleSquareMouseDown(i)}
            onMouseOver={this.handleSquareMouseOver(i)}
            onMouseUp={this.handleSquareMouseUp(i)}
        />;
    }
}

interface SquareProps {
    isPermanent: boolean;
    isHighlighted: boolean;
    isContradicting: boolean;
    value: SquareValue | null;
    markings: Set<SquareValue>;
    onMouseDown: (e: MouseEvent) => void;
    onMouseOver: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
}

class Square extends React.Component<SquareProps, {}> {
    public renderMarkings() {
        const marks: Array<SquareValue | null> = [];
        for (let i = 0; i < 9; i++) {
            marks[i] = this.props.markings.has((i + 1) as SquareValue) ? ((i + 1) as SquareValue) : null;
        }
        const list = [];
        for (let i = 0; i < 9; i++) {
            list.push(<div className="mark">{marks[i]}</div>);
        }
        return list;
    }

    public render() {
        const light: string = this.props.isHighlighted ? "highlight" : (this.props.isContradicting ? "contradict" : "");
        const permanent: string = this.props.isPermanent ? "permanent" : "";
        const displayMarkings: boolean = // determine if markings or value should be displayed
            this.props.markings.size !== 0 &&
            !this.props.isPermanent &&
            !this.props.value;
        return (
            <div
                className={"square " + light + " " + permanent}
                onMouseDown={
                    (event) => {
                        this.props.onMouseDown(event as unknown as MouseEvent);
                    }
                }
                onMouseEnter={
                    (event) => {
                        this.props.onMouseOver(event as unknown as MouseEvent);
                    }
                }
                onMouseUp={
                    (event) => {
                        this.props.onMouseUp(event as unknown as MouseEvent);
                    }
                }
            >
                {displayMarkings ? this.renderMarkings() : this.props.value}
            </div>
        );
    }
}

interface NumpadProps {
    numpadMode: NumberMode;
    onClickCorner: (i: SquareValue) => void;
    onClickDel: () => void;
    onClickNormal: (i: SquareValue) => void;
}

class Numpad extends React.Component<NumpadProps, {}> {
    public renderNumButtons() {
        const list = [];
        for (let i = 1; i <= 9; i++) {
            list.push(this.renderNumButton(i as SquareValue));
        }
        return list;
    }

    public renderNumButton(i: SquareValue) {
        return <EventPreventingButton
            onClick={(e) => {
                this.props.numpadMode === "normal" ? this.props.onClickNormal(i) : this.props.onClickCorner(i);
            }}
            className="button-num"
            variant="contained">
            {i as number}
        </EventPreventingButton>;
    }

    public render() {
        return (
            <div className="button-num-pad">
                {this.renderNumButtons()}
                <EventPreventingButton
                    onClick={this.props.onClickDel}
                    className="button"
                    variant="contained">
                    DELETE
                </EventPreventingButton>
            </div>
        );
    }
}

interface ControlProps {
    numpadMode: NumberMode;
    onClickMode: () => void;
    onClickUndo: () => void;
    onClickRedo: () => void;
}

class ControlButtons extends React.Component<ControlProps, {}> {
    public render() {
        return (
            <div className="button-col">
                <EventPreventingButton
                    onClick={this.props.numpadMode !== "normal" ? this.props.onClickMode : () => {
                    }}
                    className="button"
                    color={this.props.numpadMode !== "normal" ? "default" : "primary"}
                    variant="contained">
                    Normal
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.numpadMode !== "corner" ? this.props.onClickMode : () => {
                    }}
                    className="button"
                    color={this.props.numpadMode !== "corner" ? "default" : "primary"}
                    variant="contained">
                    Corner
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.onClickUndo}
                    className="button"
                    variant="contained">
                    Undo
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.onClickRedo}
                    className="button"
                    variant="contained">
                    Redo
                </EventPreventingButton>
            </div>
        );
    }
}

const defaultPreventingListener = (event: SyntheticEvent) => { event.preventDefault(); };

/**
 * event.preventDefault is called to ensure that
 * handleGlobalMouseDown does not run when this
 * button is clicked.
 *
 * event.preventDefault is called to ensure that
 * handleGlobalMouseUp does not run when this
 * button is clicked.
 */
class EventPreventingButton extends React.Component<ButtonProps, {}> {
    public render() {
        return (
            <Button
                {... this.props}
                onMouseDown={defaultPreventingListener}
                onMouseUp={defaultPreventingListener}
            />
        );
    }
}

export default App;
