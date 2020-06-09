
import * as _ from "lodash";
import React, {KeyboardEvent, RefObject, SyntheticEvent} from "react";
import Button, {ButtonProps} from "react-bootstrap/Button";
import "./App.css";
import {Game, Menubar, NumberMode, SquareValue} from "./Types";
import {AsciiWrapper, NORMAL_GROUPS} from "./Types";

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
            <Menubar/>
            <header className="App-header">
                <Game
                    permanentValues={vals}
                    groupings={NORMAL_GROUPS}
                />
            </header>
        </div>
    );
};



export interface SquareProps {
    isPermanent: boolean;
    isHighlighted: boolean;
    isContradicting: boolean;
    value: SquareValue | null;
    markings: Set<SquareValue>;
    onMouseDown: (e: MouseEvent) => void;
    onMouseOver: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
}

export class Square extends React.Component<SquareProps, {}> {
    public renderMarkings() {
        const marks: Array<SquareValue | null> = [];
        for (let i = 0; i < 9; i++) {
            marks[i] = this.props.markings.has((i + 1) as SquareValue) ? ((i + 1) as SquareValue) : null;
        }
        const list = [];
        for (let i = 0; i < 9; i++) {
            list.push(<div className="corner-mark">{marks[i] == null ? " " : marks[i]}</div>);
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
        const squareClassName: string = displayMarkings ? "square-with-marks" : "square";
        return (
            <div
                className={squareClassName + " " + light + " " + permanent}
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

export interface NumpadProps {
    numpadMode: NumberMode;
    onClickCorner: (i: SquareValue) => void;
    onClickDel: () => void;
    onClickNormal: (i: SquareValue) => void;
}

export class Numpad extends React.Component<NumpadProps, {}> {
    public renderNumButtons() {
        const list = [];
        for (let i = 1; i <= 9; i++) {
            list.push(this.renderNumButton(i as SquareValue));
        }
        return list;
    }

    public renderNumButton(i: SquareValue) {
        // @ts-ignore
        return <EventPreventingButton
            onClick={(e) => {
                this.props.numpadMode === "normal" ? this.props.onClickNormal(i) : this.props.onClickCorner(i);
            }}
            className="number-button"
            variant="primary">
            {i as number}
        </EventPreventingButton>;
    }

    public render() {
        return (
            <div className="Numpad">
                {this.renderNumButtons()}
                <EventPreventingButton
                    onClick={this.props.onClickDel}
                    className="delete-button"
                    variant="primary">
                    DELETE
                </EventPreventingButton>
            </div>
        );
    }
}

export interface ControlProps {
    numpadMode: NumberMode;
    onClickMode: () => void;
    onClickUndo: () => void;
    onClickRedo: () => void;
}

export class ControlButtons extends React.Component<ControlProps, {}> {
    public render() {
        return (
            <div className="Controls">
                <style type="text/css">
                    {`
                    .btn-primary, .btn-outline-primary, .btn-success, .btn-danger {
                        line-height: 0;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        font-size: 70%;
                        font-weight: 700;
                        padding: 0;
                    }
                    `}
                </style>
                <EventPreventingButton
                    onClick={this.props.numpadMode !== "normal" ? this.props.onClickMode : () => {
                    }}
                    className="control-button"
                    variant={this.props.numpadMode !== "normal" ? "outline-primary" : "primary"}>
                    Normal
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.numpadMode !== "corner" ? this.props.onClickMode : () => {
                    }}
                    className="control-button"
                    variant={this.props.numpadMode !== "corner" ? "outline-primary" : "primary"}>
                    Corner
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.onClickUndo}
                    className="control-button"
                    variant="primary">
                    Undo
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.onClickRedo}
                    className="control-button"
                    variant="primary">
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
export class EventPreventingButton extends React.Component<ButtonProps &
    React.PropsWithoutRef<JSX.IntrinsicElements["button"]>, {}> {
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
