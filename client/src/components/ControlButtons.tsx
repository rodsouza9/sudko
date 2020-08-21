import React from "react";
import {
    EventPreventingButton,
    NumberMode,
} from "../Types";
import "./ControlButtons.css";

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
                    className={this.props.numpadMode !== "normal" ? "control-button turnoff" : "control-button turnon"}
                    variant={this.props.numpadMode !== "normal" ? "outline-primary" : "primary"}>
                    Normal
                </EventPreventingButton>
                <EventPreventingButton
                    onClick={this.props.numpadMode !== "corner" ? this.props.onClickMode : () => {
                    }}
                    className= {this.props.numpadMode !== "corner" ? "control-button turnoff" : "control-button turnon"}
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
