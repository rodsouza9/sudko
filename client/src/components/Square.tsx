import React from "react";
import {SquareValue} from "../Types";
import "./Square.css";

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
