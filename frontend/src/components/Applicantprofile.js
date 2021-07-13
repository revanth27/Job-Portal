import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

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

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      name: "",
      email: "",
      userData: "",
      Data: "",
      skills: "",
      rows: [],
      editmode: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
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

          if (res.data.type === "recruiter") {
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
                email: res.data.email
              },
              () => {
         	if (this.state.userData.skills) {
         	  this.setState({ skills: this.state.userData.skills.join(',') });
         	} else {
         	  this.setState({ skills: '' });
         	}
              }
              );
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
  
  onTagsChange = (event, values) => {
    this.setState({
      skills: values
    }, () => {
      // This will output an array of objects
      // given by Autocompelte options property.
      console.log(this.state.skills);
    });
  }


  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  onSubmit(event) {
    // console.log("hi");

    event.preventDefault();
    if(this.state.editmode){
     let toRet = [];
     this.state.rows.map((item, idx) => 
     	toRet.push(this.state.rows[idx])
     ) 
     console.log("posting", toRet);
    const product = {
      name: this.state.name,
      email: this.state.email,
      applicantID: this.state.Data.id,
      skills: this.state.skills,
      education: [...this.state.rows]
    };

    if (
      product["name"] !== "" &&
      product["email"] !== "" &&
      product["applicantID"] !== ""
    ) {
      //console.log("posting", [...this.state.rows]);
      axios
        .post("http://localhost:4000/users/edit1",
        {
        	name: this.state.name,
        	email: this.state.email,
        	applicantID: this.state.Data.id,
        	skills: this.state.skills,
        	education: [...this.state.rows]
        }
        )
        .then(res => {
          // console.log("**");
          //console.log(res.);
          this.setState({
            error: "Edited Succesfully!",
            color: "green",
            name: this.state.name,
            email: this.state.email,
            skills: this.state.skills,
            education: [...this.state.rows],
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
          console.log(err);
          this.setState({
            error: "Error: Cannot Edit",
            color: "red",
            name: this.state.name,
            email: this.state.email,
            skills: this.state.skills,
            education: [...this.state.rows]
          });
        });
    } else {

      this.setState({
        name: this.state.name,
        email: this.state.email,
        skills: this.state.skills,
        education: [...this.state.rows],
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
  ////////////////////////////////////////////////
  handleChanges = idx => e => {
    const { name, value } = e.target;
    let rows = [...this.state.rows];
    rows = [...rows];
    console.log(rows);
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });
  };
  handleAddRow = () => {
    const item = {
     	name: "",
	from: "",
	to: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1)
    });
  };
  ////////////////////////////////////////////////
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
                href="/applicant/search"
                className={classes.link}
              >
                Search for a Job
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/applicant/view"
                className={classes.link}
              >
                My Applications
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

	
        <Container component="main" maxWidth="md">
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
                    <b>Skills: </b>
                    <br />
                  </FormLabel>
                  {this.state.editmode ? (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="skills"
                    id="skills"
                    autoComplete="skills"
                    onChange={this.handleChange}
                    value={this.state.skills}
                  />) : (
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="skills"
                    id="skills"
                    autoComplete="skills"
                    value={this.state.userData.skills}
                  />)}
        	  </Grid>
              </Grid>
              <br />
              
            <br />
              <Grid container>
                <Grid item>
                  <p style={styles.errorColor}>{this.state.error}</p>
                </Grid>
              </Grid>
            </form>
              
            
            
            
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell className="text-center"> # </StyledTableCell>
                    <StyledTableCell className="text-center"> Name </StyledTableCell>
                    <StyledTableCell className="text-center"> From </StyledTableCell>
                    <StyledTableCell className="text-center"> To </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {this.state.rows.map((item, idx) => (
                    <StyledTableRow id="addr0" key={idx}>
                      <StyledTableCell>{idx}</StyledTableCell>
                      <StyledTableCell>
                        <input
                          type="text"
                          name="name"
                          value={this.state.rows[idx].name}
                          onChange={this.handleChanges(idx)}
                          className="form-control"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <input
                          type="text"
                          name="from"
                          value={this.state.rows[idx].from}
                          onChange={this.handleChanges(idx)}
                          className="form-control"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <input
                          type="text"
                          name="to"
                          value={this.state.rows[idx].to}
                          onChange={this.handleChanges(idx)}
                          className="form-control"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
              <Button
                onClick={this.handleAddRow}
                className="btn btn-default pull-left"
              >
                Add Row
              </Button>
              <Button
                onClick={this.handleRemoveRow}
                className="pull-right btn btn-default"
              >
                Delete Row
              </Button>

                
                
                
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
                
                
                
            

            
            
          </div>
        </Container>
      </div>
      
      
      
      
      
      
      
      
      
      
      
    );
  }
}






export default withRouter(withStyles(styles)(ApplicantProfile));
