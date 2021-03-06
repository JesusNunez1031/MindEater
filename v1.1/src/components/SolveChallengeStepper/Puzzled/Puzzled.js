import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import classes from "./Puzzled.module.css";

class Puzzled extends Component {
    render() {
        return (
            <Paper elevation={1}>
                <div className={classes.Row}>
                    <Typography variant="h5" component="h3">Hmm...</Typography>
                </div>
            </Paper>
        );
    }
}

export default Puzzled;