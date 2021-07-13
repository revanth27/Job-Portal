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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';



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

function createData(id, name, salary, quantity) {
  return { id, name, salary, quantity };
}

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
  },
  table: {
    minWidth: 700
  }
});

class RecruiterSelected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: "",
      jobs: {},
      sortName2: false,
      sortName: false,
      sortName1: false
    };
    this.rate = this.rate.bind(this);
    this.onChangeRating = this.onChangeRating.bind(this);
    this.sortChange2 = this.sortChange2.bind(this);
    this.renderIcon2 = this.renderIcon2.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.sortChange1 = this.sortChange1.bind(this);
    this.renderIcon1 = this.renderIcon1.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // console.log("mount start");
    const jwt = getJwt();

    // console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    } else {
      // console.log("else", jwt);
      axios
        .get("http://localhost:4000/auth", {
          headers: { authorization: `Bearer: ${jwt}` }
        })
        .then(res => {
          console.log("yo", this.state);

          this.setState({
            userData: res.data
          });

          if (res.data.type === "customer") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log("mine", this.state);

          axios
            .post("http://localhost:4000/jobs/selected", {
              sellerID: this.state.userData.id
            })
            .then(resp => {
              console.log("data", resp.data);
              console.log("id", this.state.userData.id);
              this.setState({
                jobs: resp.data
              });
              console.log(this.state);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log("haha", JSON.stringify(err));
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
      console.log("final");
    }
  }

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }
  
  sortChange(){
        let array = this.state.jobs;
        var flag = this.state.sortName;
        if(array && array.length){
        if(!flag)array.sort((a, b) => a.Name.localeCompare(b.Name));
          else array.sort((a, b) => b.Name.localeCompare(a.Name));
         }
        this.setState({
            jobs:array,
            sortName:!this.state.sortName,
        })
    }
    
    renderIcon(){
        if(this.state.sortName){
            return(
                <ArrowDownwardIcon style={{ color: 'red' }}/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon style={{ color: 'red' }}/>
            )            
        }
    }
    
    sortChange1(){
        let array = this.state.jobs;
        var flag = this.state.sortName1;
        if(array && array.length){
        if(!flag)array.sort((a, b) => a.name.localeCompare(b.name));
          else array.sort((a, b) => b.name.localeCompare(a.name));
         }
        this.setState({
            jobs:array,
            sortName1:!this.state.sortName1,
        })
    }
    
    renderIcon1(){
        if(this.state.sortName1){
            return(
                <ArrowDownwardIcon style={{ color: 'red' }}/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon style={{ color: 'red' }}/>
            )            
        }
    }
  
  sortChange2(){
        let array = this.state.jobs;
        var flag = this.state.sortName2;
        if(array && array.length){
        array.sort(function(a, b) {
            if(a.rating != undefined && b.rating != undefined){
                return (1 - flag*2) * (a.rating - b.rating);
            }
            else{
                return 1;
            }
          });
         }
        this.setState({
            jobs:array,
            sortName2:!this.state.sortName2,
        })
    }

   renderIcon2(){
        if(this.state.sortName2){
            return(
                <ArrowDownwardIcon style={{ color: 'red' }}/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon style={{ color: 'red' }}/>
            )            
        }
    }
  
  onChangeRating(event, orderID) {
    const { value } = event.target;
    const key = "rating" + orderID;
    console.log("value is", orderID, value);
    this.setState(
      {
        [key]: value
      },
      () => {
        console.log("rating change", this.state);
      }
    );
  }
  
  rate(event, orderID, userID) {
    event.preventDefault();
    console.log("rating");
    const key = "rating" + orderID;

    const rating = this.state[key];

    console.log("entered", orderID, userID, rating);

    if (isNaN(rating)) {
      alert("Please select a value");
      return;
    }

    if (rating == undefined || rating <= 0) {
      alert("Please select a value");
      return;
    }

    axios
      .post("http://localhost:4000/applications/rate1", {
        orderID: orderID,
        applicantID: userID,
        ratingGiven: rating
      })
      .then(res => {
        axios
            .post("http://localhost:4000/jobs/dispatched", {
              sellerID: this.state.userData.id
            })
            .then(resp => {
              console.log("data", resp.data);
              console.log("id", this.state.userData.id);
              this.setState({
                jobs: resp.data
              });
              console.log(this.state);
            })
            .catch(err => {
              console.log(err);
            });
      })
      .catch(err => {
        console.log(err);
      });
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
              <Link variant="button" href="#" className={classes.link}>
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
        <br />
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"><Button onClick={this.sortChange1}>{this.renderIcon1()}</Button>Job Name</StyledTableCell>
                <StyledTableCell align="center"><Button onClick={this.sortChange}>{this.renderIcon()}</Button>Name</StyledTableCell>
                <StyledTableCell align="center">Job Type</StyledTableCell>
                <StyledTableCell align="center"><Button onClick={this.sortChange2}>{this.renderIcon2()}</Button>Applicant's Rating</StyledTableCell>
                <StyledTableCell align="center">Rate Applicant</StyledTableCell>
                <StyledTableCell align="center">Rate?</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.jobs && this.state.jobs.length ? (
                this.state.jobs.map(row => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.Name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.jobType}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.appRating}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    {!row.userRated ? (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-helper-label">
                              Rating
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              onChange={e => this.onChangeRating(e, row.orderID)}
                              value={this.state["rating" + row.orderID] || 0}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                            <FormHelperText>Select from 1 to 5</FormHelperText>
                          </FormControl>
                        ) : (
                          <p style={{ color: "blue" }}>
                            <b>{row.rating}</b>
                          </p>
                        )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                     {!row.userRated ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            name="isCancelled"
                            onClick={e => this.rate(e, row.orderID, row.id)}
                          >
                            Rate
                          </Button>
                        ) : (
                          <p>Already rated!</p>
                        )}
                        </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow></StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RecruiterSelected));
