import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import fire from "../../../fire";
import SolveChallengeStepper from "../../../components/SolveChallengeStepper/SolveChallengeStepper";
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import css from "./ChallengeStepper.module.css"
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Zoom from "@material-ui/core/Zoom/Zoom";
import DefaultChallengeImg from '../../../assets/svg/default-challenge.png';
import classes from "../../../components/SolveChallengeCard/SolveChallengeCard.module.css";


const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
    root: {
        maxWidth: 370,
        flexGrow: 1,
        marginTop: 20,
        boxShadow:"rgba(0, 0, 0, 0.2) 5px 10px 15px",
        background: "white",
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
    },
    img: {
        height: 255,
        display: 'block',
        maxWidth: 400,
        overflow: 'hidden',
        width: '100%',
        marginBottom: '-20px'
    },
});

class ChallengeStepper extends React.Component {
    state = {
        activeStep: -1,
        challenges: [],
        questions: [],
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    getQuestions = (challengeId) => {
        console.log("GET QUESTIONS called");
        fire.database().ref('/challenges/' + challengeId + '/questions')
            .on('child_added', questionId => {
                console.log('Question child added!');
                fire.database().ref('/questions/' + questionId.val()).once('value')
                    .then(snapshot => {
                        const updatedQuestions = [...this.state.questions]
                            .filter(question => (question.challenge === challengeId));
                        const question = snapshot.val();
                        question.id = questionId.val();
                        question.key = questionId.key;
                        updatedQuestions.push(question);
                        console.log('Updated Questions', updatedQuestions);
                        this.setState({questions: updatedQuestions});
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            });
    };

    getChallenges = () => {
        fire.database().ref('/challenges/')
            .once('value')
            .then(snapshot => {
                const updatedChallenges = [];
                const challengesObject = snapshot.val();

                fire.database().ref('/challengeImages/')
                    .once('value')
                    .then(imagesSnapshot => {
                        const imagesObject = imagesSnapshot.val();

                        fire.database().ref('/users/')
                            .once('value')
                            .then(usersSnapshot => {
                                const userObjects = usersSnapshot.val();

                                // ------ Comment out for ease of testing------
                                const currentUser = fire.auth().currentUser;
                                const completedChallenges = userObjects[currentUser.uid].completedChallenges;
                                const completedChallengesId = [];
                                for (let ch in completedChallenges) {
                                    completedChallengesId.push(ch);
                                }
                                // ---------------------------------

                                for (let challengeId in challengesObject) {
                                    if (!completedChallengesId.includes(challengeId)) {   // <------ Comment out for ease of testing------
                                        const challenge = challengesObject[challengeId];
                                        challenge.id = challengeId;
                                        if (imagesObject) {
                                            challenge.imgURL = (imagesObject[challengeId]) ? imagesObject[challengeId].imgURL : DefaultChallengeImg;
                                            const challengeOwner = challenge.owner;
                                            challenge.authorName = userObjects[challengeOwner].username;
                                        }
                                        if (!challenge.isPartial) {    // TODO: Check if owner is not this user
                                            updatedChallenges.push(challenge);
                                        }
                                    }   // <------ Comment out for ease of testing------
                                }
                                updatedChallenges.sort((a, b) => (a.timesCompleted - b.timesCompleted));
                                this.setState({challenges: updatedChallenges, loading: false});
                            }).catch(error => {
                            alert(error.message)
                        });
                    });
            });
    };

    setCompletedListeners = (user) => {
        fire.database().ref('/users/' + user.uid)
            .on('child_changed', snapshot => {
                this.getChallenges();
            });
        fire.database().ref('/users/' + user.uid)
            .on('child_added', snapshot => {
                this.getChallenges();
            });
    };


    componentDidMount() {
        this.setState({loading: true, activeStep: 0});

        if (this.state.challenges.length === 0) {
            this.getChallenges();
        }

        if (this.state.challenges.length > 0) {
            this.getQuestions(this.state.challenges[this.state.activeStep].id);
        }

        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setCompletedListeners(user);
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.activeStep !== this.state.activeStep && !prevProps.open) {
            if (this.state.activeStep < this.state.challenges.length && this.state.activeStep >= 0) {
                this.getQuestions(this.state.challenges[this.state.activeStep].id);
            }
        }
        if (this.state.challenges.length !== prevState.challenges.length && this.state.questions.length === 0) {
            if (this.state.activeStep < this.state.challenges.length && this.state.activeStep >= 0) {
                this.getQuestions(this.state.challenges[this.state.activeStep].id);
            }
        }
    }

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    handleStepChange = activeStep => {
        if (!this.state.open) {
            this.setState({activeStep});
        }
    };

    render() {
        const {classes, theme} = this.props;
        const {activeStep} = this.state;
        let maxSteps = 5;
        if (this.state.challenges.length < maxSteps) {
            maxSteps = this.state.challenges.length;
        }

        const popularChallenges = this.state.challenges.slice(0, maxSteps);

        return (
            <>
                <div className={classes.root}>
                    <CardHeader style={{background: "#ffea00"}}/>
                    <Paper square elevation={0} className={classes.header}
                           style={{display: "flex", flexFlow: "column"}}>
                        <Typography style={{display: "flex", fontSize:30, marginBottom:20, fontWeight:"bold"}}>Popular Challenges</Typography>
                        <Typography
                            style={{display: "flex", marginTop:20, fontSize:18}}>{
                            popularChallenges[activeStep]
                                ? popularChallenges[activeStep].title : "Challenge"}
                        </Typography>
                        <Typography style={{display: "flex", fontSize:12, marginTop:25, fontWeight:"light", fontStyle:"italic"}}>
                            Author: {this.state.challenges.length > 0
                                ? this.state.challenges[this.state.activeStep].authorName
                                : "User"
                            }

                        </Typography>
                    </Paper>
                    <Tooltip classes={{tooltip: css.Tool}} TransitionComponent={Zoom} TransitionProps={{ timeout: 600 }} placement={"left"} title={"Solve Challenge"} enterDelay={20} leaveDelay={200}>
                    <CardActionArea style={{marginTop:30}}>
                    <AutoPlaySwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={this.handleStepChange}
                        enableMouseEvents
                    >
                        {popularChallenges.map((step, index) => (
                            <div key={step.label}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <img
                                        className={classes.img}
                                        src={step.imgURL}
                                        alt={step.title}
                                        onClick={this.handleClickOpen}
                                    />
                                ) : null}
                            </div>
                        ))}

                    </AutoPlaySwipeableViews>
                    </CardActionArea>
                    </Tooltip>
                    <MobileStepper
                        steps={maxSteps}
                        variant={"dots"}
                        position="static"
                        activeStep={activeStep}
                        classes={{dotActive: css.Stepper}}
                        nextButton={
                            <Button className={css.Next} size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1 || maxSteps === 0}>
                                Next
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                            </Button>
                        }
                        backButton={
                            <Button className={css.Back} size="small" onClick={this.handleBack} disabled={activeStep === 0 || maxSteps === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                                Back
                            </Button>
                        }
                    />
                </div>
                {this.state.challenges.length > 0 ?
                    <SolveChallengeStepper
                        open={this.state.open}
                        closed={this.handleClose}
                        questions={this.state.questions}
                        challengeTitle={this.state.challenges[this.state.activeStep].title}
                        challengeDescription={this.state.challenges[this.state.activeStep].description}
                    /> : null
                }
            </>
        );
    }
}

ChallengeStepper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(ChallengeStepper);