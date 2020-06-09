import React from "react";
import {
    EventPreventingButton,
    NumberMode,
    SquareValue,
} from "../Types";
import "./Numpad.css";

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
