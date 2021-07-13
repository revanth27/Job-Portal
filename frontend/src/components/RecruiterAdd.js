import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { getJwt } from "./../helpers/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import DateTimePicker from 'react-datetime-picker'

const styles = theme => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
});

class RecruiterAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      salary: "",
      quantity: "",
      pos: "",
      jobType: "Full-time",
      duration: "1",
      skills: "",
      deadline: new Date(),
      error: "",
      userData: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log("mount start");
    const jwt = getJwt();

    console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    } else {
      console.log("else", jwt);
      axios
        .get("http://localhost:4000/auth", {
          headers: { authorization: `Bearer: ${jwt}` }
        })
        .then(res => {
          console.log("yo", this.state);

          this.setState({
            userData: res.data
          });

          if (res.data.type === "applicant") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log(this.state);
        })
        .catch(err => {
          console.log("haha", JSON.stringify(err));
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
      console.log("final");
    }
  }

  handleChange(event) {
    console.log("here");
    console.log(this.state);
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    // console.log(this.state)
  }
  
  updateState(date) {
    // This function gives you the moment object of date selected.
    console.log("aa");
    //this.state.deadline = date;
    this.setState({...this.state, deadline: date}) 
    console.log(date);
  }

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  onSubmit(event) {
    // console.log("hi");

    event.preventDefault();
    //const newdate = new Date();
    const job = {
      name: this.state.name,
      salary: this.state.salary,
      quantity: this.state.quantity,
      pos: this.state.pos,
      jobType: this.state.jobType,
      duration: this.state.duration,
      sellerID: this.state.userData.id,
      deadline: this.state.deadline,
      postDate: this.state.posDate,
      skills: this.state.skills
    };

    if (
      job["name"] !== "" &&
      job["salary"] !== "" &&
      job["quantity"] !== "" &&
      job["pos"] !== "" &&
      job["jobType"] !== "" &&
      job["duration"] !== "" &&
      job["deadline"] !== "" &&
      job["skills"] !== "" &&
      job["sellerID"] !== ""
    ) {
      console.log("posting", job);
      axios
        .post("http://localhost:4000/jobs/add", job)
        .then(res => {
          // console.log("**");
          // console.log(res.data.User);
          this.setState({
            error: "Job Added Succesfully!",
            color: "green",
            name: "",
            salary: "",
            quantity: "",
            pos: "",
            skills: "",
            deadline: this.state.deadline,
            jobType: "Full-time",
            duration: "1",
            postDate: new Date()
          });
        })
        .catch(err => {
          // console.log("errored");
          this.setState({
            error: "Error: Cannot Add Job",
            color: "red",
            name: this.state.name,
            salary: this.state.salary,
            quantity: this.state.quantity,
            pos: this.state.pos,
            jobType: this.state.jobType,
            duration: this.state.duration,
            deadline: this.state.deadline,
            skills: this.state.skills
          });
        });
    } else {

      this.setState({
        name: this.state.name,
        salary: this.state.salary,
        quantity: this.state.quantity,
        pos: this.state.pos,
        jobType: this.state.jobType,
        duration: this.state.duration,
        deadline: this.state.deadline,
        skills: this.state.skills,
        error: "All fields are Mandatory!",
        color: "red"
      });
    }
  }

  render() {
    const { classes } = this.props;

    const styles = {
      errorColor: {
        color: this.state.color
      }
    };

    return (
      <div>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            >
              Job Application Portal
            </Typography>
            <nav>
              <Link variant="button" href="#" className={classes.link}>
                Add
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/recruiter/view"
                className={classes.link}
              >
                View
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/recruiter/selected"
                className={classes.link}
              >
                Employees
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/recruiter/profile"
                className={classes.link}
              >
                Profile
              </Link>
            </nav>
            <Button
              href="#"
              color="primary"
              variant="outlined"
              className={classes.link}
              onClick={this.logout}
            >
              Log Out
            </Button>
          </Toolbar>
        </AppBar>

	
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              <br />
              <center>
                <b>ADD A JOB</b>
              </center>
              <br />
              <br />
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="legend">
                    <b>Name of Job:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Salary of job: (in INR)</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="salary"
                    id="salary"
                    autoComplete="salary"
                    onChange={this.handleChange}
                    value={this.state.salary}
                  />
                </Grid>
                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Max number of Applications:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="quantity"
                    id="quantity"
                    autoComplete="quantity"
                    onChange={this.handleChange}
                    value={this.state.quantity}
                  />
                </Grid>
                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Max number of Positions:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="pos"
                    id="pos"
                    autoComplete="pos"
                    onChange={this.handleChange}
                    value={this.state.pos}
                  />
                </Grid>
                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Skills: </b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="skills"
                    id="skills"
                    autoComplete="skills"
                    onChange={this.handleChange}
                    value={this.state.skills}
                  />
              </Grid>
              </Grid>
              <br />
	
	  <div className="input-group-append">
            <span className="input-group-text">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-helper">Job Type</InputLabel>
                <NativeSelect
                  value={this.state.jobType}
                  onChange={this.handleChange}
                  name="jobType"
                >
                  <option selected value="Full-time">
                    Full-time
                  </option>
                  <option value="Part-time">Part-time</option>
                  <option value="Work from home">Work from home</option>
                </NativeSelect>
                <FormHelperText>Default selected is Full-time</FormHelperText>
              </FormControl>
            </span>
          </div>
          
          <br />
          
          <div className="input-group-append">
            <span className="input-group-text">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-helper">Duration (months)</InputLabel>
                <NativeSelect
                  value={this.state.duration}
                  onChange={this.handleChange}
                  name="duration"
                >
                  <option selected value="0">
                    0
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </NativeSelect>
                <FormHelperText>Default selected is Full-time</FormHelperText>
              </FormControl>
            </span>
          </div>
      	  <br/>
	<div>
      		<DateTimePicker
      		name="deadline"
        	value={this.state.deadline}
        	onChange={(date) => this.setState({deadline: date})}
      		/>
       </div>
      
          <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Add Job
              </Button>
              <br />
              <br />
              <Grid container>
                <Grid item>
                  <p style={styles.errorColor}>{this.state.error}</p>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RecruiterAdd));
