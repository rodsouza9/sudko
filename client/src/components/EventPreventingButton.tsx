import React, {SyntheticEvent} from "react";
import Button, {ButtonProps} from "react-bootstrap/Button";

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
