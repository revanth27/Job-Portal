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
import Input from "@material-ui/core/Input";
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
import NativeSelect from "@material-ui/core/NativeSelect";
import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';


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

function createData(name, id, salary, quantityRemaining) {
  return { name, id, salary, quantityRemaining };
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
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class ApplicantSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: "",
      search: "",
      jobtype: "None",
      jobs: {},
      max: "",
      min: "",
      sop: "",
      durat: "None",
      sortName:true,
      sortName1:true,
      sortName2: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleJob = this.handleJob.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.sortChange1 = this.sortChange1.bind(this);
    this.sortChange2 = this.sortChange2.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderIcon1 = this.renderIcon1.bind(this);
    this.renderIcon2 = this.renderIcon2.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.order = this.order.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const jwt = getJwt();

    console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    } else {
      axios
        .get("http://localhost:4000/auth", {
          headers: { authorization: `Bearer: ${jwt}` }
        })
        .then(res => {
          this.setState({
            userData: res.data
          });

          if (res.data.type === "recruiter") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log("userData is", this.state.userData);
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
    // console.log(this.state);
    const { name, value, type } = event.target;
    this.setState(
      {
        [name]: value
      }
      );
  }
  
  handleJob(event) {
    const { name, value, type } = event.target; 
    this.setState(
      {
        [name]: value
      },
    () => axios
         .post("http://localhost:4000/jobs/duration", {
        search: this.state.search,
        jobtype: this.state.jobtype,
        max: this.state.max,
        min: this.state.min,
        durat: this.state.durat
      })
      .then(resp => {
        this.setState({
          jobs: resp.data
        });
        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      }),
      );
  }
  
  sortChange(){
        let array = this.state.jobs;
        var flag = this.state.sortName;
        if(array && array.length){
        array.sort(function(a, b) {
            if(a.salary != undefined && b.salary != undefined){
                return (1 - flag*2) * (a.salary - b.salary);
            }
            else{
                return 1;
            }
          });
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
        array.sort(function(a, b) {
            if(a.duration != undefined && b.duration != undefined){
                return (1 - flag*2) * (a.duration - b.duration);
            }
            else{
                return 1;
            }
          });
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
            if(a.recruiterRating != undefined && b.recruiterRating != undefined){
                return (1 - flag*2) * (a.recruiterRating - b.recruiterRating);
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

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  onSubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:4000/jobs/duration", {
        search: this.state.search,
        jobtype: this.state.jobtype,
        max: this.state.max,
        min: this.state.min,
        durat: this.state.durat,
        applicantID: this.state.userData.id
      })
      .then(resp => {
        // console.log("data", resp.data);
        // console.log("id", this.state.userData.id);
        this.setState({
          jobs: resp.data
        });
        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      });
  }
  

  handleQuantity(event, id) {
    const { value } = event.target;
    this.setState({
      [id]: value
    });
    console.log(this.state);
  }

  order(event, id, quantityRemaining, active, select_status) {
    console.log("ordering");

    const entered = 1;
    const trig = new Date();
    if(select_status == 1) {
    	alert("Your are already selected for a job.");
        return;
    }
    if (entered > quantityRemaining) {
      alert("Your required quantity should be less than remaining quantity.");
      return;
    }
    if (active >= 10) {
      alert("Your number of active applications reached 10.");
      return;
    }
    
    var entersop = prompt("Please enter the statement of purpose.");
    //return;
	var valued = new Date();
	//const sop = prompt("Statement of puprpose");
    axios
      .post("http://localhost:4000/applications/buy", {
        jobID: id,
        applicantID: this.state.userData.id,
        buyQuantity: entered,
        orderDate: trig,
        sop: entersop 
      })
      .then(res => {
        axios
          .post("http://localhost:4000/jobs/duration", {
            search: this.state.search,
            jobtype: this.state.jobtype,
            max: this.state.max,
            min: this.state.min,
            durat: this.state.durat,
            applicantID: this.state.userData.id
          })
          .then(resp => {
            alert("Applied sucessfully");
            // console.log("data", resp.data);
            // console.log("id", this.state.userData.id);
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
              <Link
                variant="button"
                color="textPrimary"
                href="/applicant/profile"
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

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            name="search"
            placeholder="Search for a Job"
            aria-label="Amount (to the nearest dollar)"
            onChange={this.handleChange}
            value={this.state.search}
          />

          <div className="input-group-append">
            <span className="input-group-btn">
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                <SearchIcon />
              </Button>
            </span>
            <span className="input-group-text">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-helper">Job type filter</InputLabel>
                <NativeSelect
                  name="jobtype"
                  onChange={this.handleJob}
                  value={this.state.jobtype}
                >
                  <option selected value="None">None</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Work from home">Work from home</option>
                </NativeSelect>
                <FormHelperText>Default selected is None</FormHelperText>
              </FormControl>
            </span>
            <span className="input-group-text">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-helper">Duration filter</InputLabel>
                <NativeSelect
                  name="durat"
                  onChange={this.handleJob}
                  value={this.state.durat}
                >
                  <option selected value="None">None</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </NativeSelect>
                <FormHelperText>Default selected is None</FormHelperText>
              </FormControl>
            </span>
          </div>
        </div>
        
        <div>
        	<Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
          <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="legend">
                    <b>Enter max:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="max"
                    name="max"
                    autoComplete="max"
                    onChange={this.handleChange}
                    value={this.state.max}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormLabel component="legend">
                    <b>Enter min:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="min"
                    name="min"
                    autoComplete="min"
                    onChange={this.handleChange}
                    value={this.state.min}
                  />
                </Grid>
              </Grid>  
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Filter
              </Button>
             </form>
             </div>
            </Container>
        </div>

        <br />
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr. No</StyledTableCell>
                <StyledTableCell>Recruiter Name</StyledTableCell>
                <StyledTableCell>Job Name</StyledTableCell>
                <StyledTableCell>Application</StyledTableCell>
                <StyledTableCell>Recruiter Email</StyledTableCell>
                <StyledTableCell>Required Skills</StyledTableCell>
                <StyledTableCell>Date of Posting</StyledTableCell>
                <StyledTableCell>Deadline</StyledTableCell>
                <StyledTableCell>Job Type</StyledTableCell>
                <StyledTableCell align="right"><Button onClick={this.sortChange2}>{this.renderIcon2()}</Button>Job Rating</StyledTableCell>
                <StyledTableCell align="right">Job Name</StyledTableCell>
                <StyledTableCell align="right"><Button onClick={this.sortChange1}>{this.renderIcon1()}</Button>Duration</StyledTableCell>
                <StyledTableCell align="right"><Button onClick={this.sortChange}>{this.renderIcon()}</Button>Salary</StyledTableCell>
                <StyledTableCell align="right">
                   Positions
                </StyledTableCell>
                <StyledTableCell align="right">Job Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.jobs && this.state.jobs.length ? (
                this.state.jobs.map(row => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.recruiterName}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                  {
                  	//<Table>
                  	row.skills.map((list, i) => (

                  		<StyledTableRow key={i}>
                  		{
                  			
                  			<StyledTableCell align="center">{list}</StyledTableCell>
                  			
                  		}
                  		</StyledTableRow>
			
                  	))
                  	//</Table>
                  
                  }
                  </StyledTableCell>
                    <StyledTableCell component="th" scope="row">{moment(row.postDate).format('DD-MM-YYYY')}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">{moment(row.deadline).format('DD-MM-YYYY')}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.jobType}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.recruiterRating}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.duration}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.salary}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.pos}
                    </StyledTableCell>
                    
                    
                    {row.isApplied ? 
                    	(<StyledTableCell align="right"><Button variant="contained" style={{ backgroundColor: "#21b6ae" }}>Applied</Button></StyledTableCell>) : (
                    	[row.quantityRemaining === 0 ?
                    		(<StyledTableCell align="right"><Button variant="contained" color="secondary">Full</Button></StyledTableCell>) : (
                    		<StyledTableCell align="right">
                    		  <Button
                       	 variant="contained"
                       	 color="primary"
                       	 name="isCancelled"
                       	 onClick={e =>
                       	   [this.order(e, row._id, row.quantityRemaining, row.active, row.haveSelected),
                       	    this.handleQuantity(e, row._id)]
                       	 }
                      		>
                       	 Apply
                      		</Button>
                    	     </StyledTableCell>
                    	  )
                    	
                    	]
                    )
                    
                    }
                    
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

export default withRouter(withStyles(styles)(ApplicantSearch));
