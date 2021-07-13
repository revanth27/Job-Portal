import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { getJwt } from "./../helpers/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";

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

class RecruiterProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      name: "",
      email: "",
      bio: "",
      userData: "",
      Data: "",
      contact: "",
      editmode: false
    };

    this.handleChange = this.handleChange.bind(this);
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
            Data: res.data
          });

          if (res.data.type === "applicant") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          axios
            .post("http://localhost:4000/users/profile", {
              applicantID: this.state.Data.id
            })
            .then(res => {
              this.setState({
                userData: res.data,
                name: res.data.Name,
                email: res.data.email,
                contact: res.data.contact,
                bio: res.data.bio
              });
            })
            .catch(err => {	
              console.log(err);
            });
        })
        .catch(err => {
          console.log("now");
          // console.log(this.state.userData);
          console.log(err);
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
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

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  onSubmit(event) {
    // console.log("hi");

    event.preventDefault();
		if(this.state.editmode){
    const job = {
      name: this.state.name,
      email: this.state.email,
      bio: this.state.bio,
      contact: this.state.contact,
      applicantID: this.state.Data.id
    };

    if (
      job["name"] !== "" &&
      job["email"] !== "" &&
      job["applicantID"] !== ""
    ) {
      console.log("posting", job);
      axios
        .post("http://localhost:4000/users/edit",
        {
        	name: this.state.name,
        	email: this.state.email,
        	bio: this.state.bio,
        	contact: this.state.contact,
        	applicantID: this.state.Data.id
        }
        )
        .then(res => {
          // console.log("**");
          // console.log(res.data.User);
          this.setState({
            error: "Edited Succesfully!",
            color: "green",
            name: this.state.name,
            email: this.state.email,
            bio: this.state.bio,	
            contact: this.state.contact,
            editmode: !this.state.editmode
          });
          axios
            .post("http://localhost:4000/users/profile", {
              applicantID: this.state.Data.id
            })
            .then(res => {
              this.setState({
                userData: res.data
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          // console.log("errored");
          this.setState({
            error: "Error: Cannot Edit",
            color: "red",
            name: this.state.name,
            email: this.state.email,
            bio: this.state.bio,
            contact: this.state.contact,
          });
        });
    } else {

      this.setState({
        name: this.state.name,
        email: this.state.email,
        bio: this.state.bio,
        contact: this.state.contact,
        error: "All fields are Mandatory!",
        color: "red"
      });
    }
    } else {
    	this.setState({
    		editmode: !this.state.editmode
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
            	<Link
                variant="button"
                color="textPrimary"
                href="/recruiter/add"
                className={classes.link}
              >
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
     	      <Link variant="button" href="#" className={classes.link}>
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
                <b>PROFILE</b>
              </center>
              <br />
              <br />
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="legend">
                    <b>Name:</b>
                    <br />
                  </FormLabel>
                  {this.state.editmode ? (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />) : (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={this.state.userData.Name}
                  />)}
                </Grid>

                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Email: </b>
                    <br />
                  </FormLabel>
                  {this.state.editmode ? (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="email"
                    id="email"
                    autoComplete="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />) : (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="email"
                    id="email"
                    autoComplete="email"
                    value={this.state.userData.email}
                  />)}
                </Grid>
                
                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Contact: </b>
                    <br />
                  </FormLabel>
                  {this.state.editmode ? (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="contact"
                    id="contact"
                    autoComplete="contact"
                    onChange={this.handleChange}
                    value={this.state.contact}
                  />) : (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="contact"
                    id="contact"
                    autoComplete="contact"
                    value={this.state.userData.contact}
                  />)}
                </Grid>
                
              </Grid>
              <br />
              <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon">
                <i className="fas fa-pencil-alt prefix">Bio</i>
                </span>
            </div>
            {this.state.editmode ? 
            	(<textarea className="form-control" id="bio" name="bio" rows="5" onChange={this.handleChange} value={this.state.bio} />) :
            		(<textarea className="form-control" id="bio" name="bio" rows="5" value={this.state.userData.bio} />) }
           </div>
              <br />
              {this.state.editmode ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Submit
              </Button>) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Edit
              </Button>)}
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

export default withRouter(withStyles(styles)(RecruiterProfile));
