import {Button} from "@material-ui/core";
import React from "react";

interface DateButtonState {
    date: string | null;
}
// tslint:disable-next-line:no-empty-interface
interface DateButtonProps {}

export class DateButton extends React.Component<DateButtonProps, DateButtonState> {
    public state: DateButtonState = {
        date: null,
    };
    constructor(props: DateButtonProps) {
        super(props);
    }

    public getDate() {
        console.log("Date Button works");
        console.log(
            fetch("/date")
                .then( (res) => res.text())
                .then( (date) => console.log(date)),
        );
    }

    public render() {
        return (
            <Button
                className={"ascii-button"}
                onClick={() => {this.getDate(); }}
                variant="contained"
                size={"large"}
                color={"primary"}>
                {this.state.date == null ? "DATE" : this.state.date}
            </Button>
        );
    }
}
