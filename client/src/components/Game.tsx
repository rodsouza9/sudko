import * as _ from "lodash";
import React, {KeyboardEvent, RefObject} from "react";
import * as Validate from "../Types";
import {
    ControlButtons,
    EventPreventingButton,
    KEY_1,
    KEY_9,
    KEY_COMMAND,
    KEY_DELETE,
    KEY_TAB,
    Numpad,
    Square,
} from "../Types";

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

const initialBoardState: BoardState = {
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

export class Game extends React.Component<BoardProps, BoardState> {
    public state: BoardState = _.cloneDeep(initialBoardState);

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
        const newContradictions = Validate.normalSudokuValidator(allValues);
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
            const newState: BoardState = _.cloneDeep(initialBoardState);
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
        if (e.which === KEY_COMMAND) { // Command Key
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
        if (e.which === KEY_COMMAND) {
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
                    <div className="game-inside">
                        <div className="board">{this.renderSquares()}</div>
                        <div className="button-box">
                            <div className="button-container">
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
                                <div className="Footer">
                                    <EventPreventingButton
                                        className="footer-button"
                                        variant="danger"
                                        onClick={() => {this.restart(); }}>
                                        RESTART
                                    </EventPreventingButton>
                                    <EventPreventingButton
                                        className="footer-button"
                                        variant="success"
                                        onClick={() => {this.updateContradictions(); }}
                                    >
                                        CHECK
                                    </EventPreventingButton>
                                </div>
                            </div>
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
