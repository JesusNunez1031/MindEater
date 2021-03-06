import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import classes from "./SolveChallengeSummary.module.css";
import withMobileDialog from "@material-ui/core/es/withMobileDialog/withMobileDialog";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core";
import green from "@material-ui/core/es/colors/green";
import Question from "@material-ui/icons/ContactSupportOutlined"
import CorrectAnswer from "@material-ui/icons/DoneOutlineSharp"
import Submission from "@material-ui/icons/TouchAppOutlined"
import Score from "@material-ui/icons/GradeOutlined"

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
    overrides: {
        MuiButton: {
            raisedPrimary: {
                color: 'white',
            },
        },
    },
    typography: {
        useNextVariants: true,
    },
});

class SolveChallengeSummary extends Component {

    // Expected props
    // 1. open          (bool)
    // 2. closed        (func)
    // 3. closeStepper  (func)
    // 4. questions     (Array)     - These objects are expected to contain the user's answer and score.
    // 5. score         (number)

    // TODO: Decide which component will push to firebase.

    handleOk = () => {
        this.props.closed();
        this.props.closeStepper();
    };

    render() {
        const {fullScreen} = this.props;

        return (
            <Dialog
                open={this.props.open}
                fullScreen={fullScreen}
                aria-labelledby="challenge-summary-dialog-title"
                aria-describedby="challenge-summary-dialog-description"
            >
                <DialogTitle id="challenge-summary-dialog-title">{"Challenge Summary"}</DialogTitle>
                <DialogContent className={classes.Content}>
                    <Table>
                        <TableHead>
                            <TableRow style={{padding:0}}>
                                <TableCell className={classes.CellStyle}>Question<Question style={{color:"blue"}}/></TableCell>
                                <TableCell className={classes.CellStyle}>Correct Answer<CorrectAnswer style={{color:"green"}}/></TableCell>
                                <TableCell className={classes.CellStyle}>Your Answer<Submission style={{color:"black"}}/></TableCell>
                                <TableCell numeric className={classes.CellStyle}>Score<Score style={{color:"red"}}/></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.questions.map(question => (
                                    <TableRow key={question.id}>
                                        <TableCell component="th" scope="row">
                                            {question.question}
                                        </TableCell>
                                        <TableCell className={classes.CellStyle}>{question.correctOption}</TableCell>
                                        <TableCell className={classes.CellStyle}>{question.selectedAnswer}</TableCell>
                                        <TableCell numeric className={classes.CellStyle}>{question.score}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <DialogContentText className={classes.Score} id="solve-question-dialog-description">
                        You scored {this.props.score} points!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiThemeProvider theme={theme}>
                    <Button
                        className={classes.okBttn}
                        onClick={this.handleOk}
                        variant={"raised"}
                        color={"primary"}
                        size={"large"}
                        autoFocus={true}
                    >
                        Ok
                    </Button>
                    </MuiThemeProvider>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withMobileDialog('xs')(SolveChallengeSummary);