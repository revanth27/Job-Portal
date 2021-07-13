import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
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
import moment from 'moment';
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

function createData(_id, Name, skills, sap, orderDate, sop, rating) {
  return { _id, Name, skills, sap, orderDate, sop, rating };
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
  }
});

class RecruiterApplicants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: "",
      jobs: {},
      sortName: false,
      sortName1: false,
      sortName2: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this.sortChange2 = this.sortChange2.bind(this);
    this.renderIcon2 = this.renderIcon2.bind(this);
    this.sortChange1 = this.sortChange1.bind(this);
    this.renderIcon1 = this.renderIcon1.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const jwt = getJwt();
	const { sid } = this.props.match.params;
    console.log(sid);

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

          if (res.data.type === "applicant") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          axios
            .post("http://localhost:4000/applications/appl", {
              jobID: sid
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
          console.log("now");
          // console.log(this.state.userData);
          console.log(err);
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
        
       console.log("final");
    }
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

        var array = this.state.jobs;
        var flag = this.state.sortName1;
        array.sort(function(a, b) {
            if(a.orderDate != undefined && b.orderDate != undefined){
                return (1 - flag*2) * (new Date(a.orderDate) - new Date(b.orderDate));
            }
            else{
                return 1;
            }
          });
        this.setState({
            jobs:array,
            sortName:!this.state.sortName1,
        })
    }

    renderIcon1(){
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

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }
  
  
  onSubmit(e, name, orderID) {
  	let value;
  	const { sid } = this.props.match.params;
    	console.log(sid);
  	if(name === "reject")value = 3;
  	if(name === "shortlist")value = 1;
  	if(name === "accept")value = 2;
  	axios
  		.post("http://localhost:4000/applications/update", {orderID: orderID, jobID: sid, sap: value})
  		.then(rek => {
  			let userID = rek.data.userID;
  			let posRemaining = rek.data.posRemaining;
  			
  			console.log(posRemaining);
  			axios
            			.post("http://localhost:4000/applications/appl", {
            			  jobID: sid
            			})
            			.then(resp => {
           			 console.log("data", resp.data);
           			 console.log("id", this.state.userData.id);
           			 this.setState({
              	 			 jobs: resp.data
              			 });
              			 
              			 //let userID = resp.data.userID;
              			 //console.log(userID);
              			 if(value == 2) {
              			 console.log("hey");
              			 //console.log(resp.data.userID);
              			 	axios
              			 		.post("http://localhost:4000/applications/reject", {id: userID})
              			 		.then(res => {
              			 		console.log("hello");
           			 			axios
            							.post("http://localhost:4000/applications/appl", {
            							  jobID: sid
            							})
            							.then(rey => {
           							 console.log("data", rey.data);
           							 console.log("id", this.state.userData.id);
           							 this.setState({
              	 							 jobs: rey.data
              							 });
              							})
              							.catch(err => {
            			  					console.log(err);
            							});
              					
              			 		})
              			 		.catch(err => {
            			  			console.log(err);
            					});
              			 }
              			 
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
    
    let rows = [];

    for (let i = 0; i < this.state.jobs.length; i++) {
    if(this.state.jobs[i].sap != 3)
      rows.push(
        createData(
          this.state.jobs[i]._id,
          this.state.jobs[i].Name,
          this.state.jobs[i].skills,
          this.state.jobs[i].sap,
          this.state.jobs[i].orderDate,
          this.state.jobs[i].sop,
          this.state.jobs[i].rating
        )
      );
    }
    
    console.log(rows);
    
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
                <StyledTableCell><Button onClick={this.sortChange}>{this.renderIcon()}</Button>Name</StyledTableCell>
                <StyledTableCell>Skills</StyledTableCell>
                <StyledTableCell align="right"><Button onClick={this.sortChange1}>{this.renderIcon1()}</Button>Date of Application</StyledTableCell>
                <StyledTableCell align="right">Stage of Application</StyledTableCell>
                <StyledTableCell align="right">SOP</StyledTableCell>
                <StyledTableCell align="right"><Button onClick={this.sortChange2}>{this.renderIcon2()}</Button>Rating</StyledTableCell>
                <StyledTableCell align="right">Shortlist/Accept</StyledTableCell>
                <StyledTableCell align="right">Reject</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row._id}>
                
                
                  <StyledTableCell component="th" scope="row">
                  	{row.Name}
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
                  
                  <StyledTableCell align="right">
                    {moment(row.orderDate).format('DD-MM-YYYY')}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                  	{row.sap+1}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                  	{row.sop}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                  	{row.rating}
                  </StyledTableCell>
                  {row.sap == 2 ? 
                  	 (<StyledTableCell align="right"><Button variant="contained" style={{ backgroundColor: "#21b6ae" }}>Selected</Button></StyledTableCell>) :
                  	 (
                  	 	[
                  	 		row.sap == 1 ? 
                  	 		 (
                  	 		 	<StyledTableCell align="right">
                    		  			<Button
                       	 			variant="contained"
                       	 			color="primary"
                       	 			name="accept"
                       	 			onClick={e => this.onSubmit(e, "accept", row._id)}
                      					>
                       				 Accept
                      					</Button>
                    	     		      </StyledTableCell>
                  	 		 ) :
                  	 		 (
                  	 		 	<StyledTableCell align="right">
                    		  			<Button
                       	 			variant="contained"
                       	 			color="primary"
                       	 			name="shortlist"
                       	 			onClick={e => this.onSubmit(e, "shortlist", row._id)}
                      					>
                       				 Shortlist
                      					</Button>
                    	     		      </StyledTableCell>
                  	 		 )
                  	 	]
                  	 )
                  }
          	   
          	   {row.sap == 2 ? 
          	   	(<StyledTableCell align="right"></StyledTableCell>) :
          	   	(
          	   		<StyledTableCell align="right">
                    		  	<Button
                       	 	variant="contained"
                       	 	color="secondary"
                       	 	name="reject"
                       	 	onClick={e => this.onSubmit(e, "reject", row._id)}
                      			>
                       		 Reject
                      			</Button>
                    	     	</StyledTableCell>
          	   	)
          	   }
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RecruiterApplicants));
