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
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker'

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

function createData(id, name, postDate, quantity, quantityRemaining, pos, posRemaining, deadline) {
  return { id, name, postDate, quantity, quantityRemaining, pos, posRemaining, deadline };
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

class RecruiterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: "",
      jobs: {},
      editmode: false
    };

    this.logout = this.logout.bind(this);
    this.getRedirect = this.getRedirect.bind(this);
    this.posChange = this.posChange.bind(this);
    this.deadlineChange = this.deadlineChange.bind(this);
    this.handleDeadline = this.handleDeadline.bind(this);
    this.quanChange = this.quanChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handlePosition = this.handlePosition.bind(this);
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

          if (res.data.type === "applicant") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log("mine", this.state);

          axios
            .post("http://localhost:4000/jobs/seller", {
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

  handleChange(event, id) {
    console.log(id);
    axios
      .post("http://localhost:4000/jobs/cancel", { id: id })
      .then(res => {
        console.log("cancelled");
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      jobs: this.state.jobs.filter(jobs => jobs._id != id)
    });
  }
  
  posChange(event, id, newQuantity, newQuantityRemaining)
  {
  	const key = "quantity" + id;
  	const quan = this.state[key];
  	console.log(quan);
  	newQuantityRemaining = Number(newQuantityRemaining) + Number(quan) - Number(newQuantity);
  	if(newQuantityRemaining < 0)
  	{
  		alert(
        		"Your required no.of max applications should exceed the number of applications applied."
      		);
      		return;
  	} 
  	newQuantity=quan;
  	console.log(id);
  	axios
  		.post("http://localhost:4000/jobs/edit1", { 
  			id: id, 
  			newQuantity: newQuantity, 
  			newQuantityRemaining: newQuantityRemaining.toString()
  		})
  		.then(res => {
  			axios
          		.post("http://localhost:4000/jobs/seller", {
          		  sellerID: this.state.userData.id
          		})
          		.then(res => {
          		  this.setState({
          		    jobs: res.data
          		  });
          		  alert("Edited Succesfully");
          		})
          		.catch(err => {
          		  console.log(err);
          		});
  		})
  		.catch(err => {
  			console.log(err);
  		});
  }
  
  deadlineChange(event, id, deadline)
  {
  	const key = "deadline" + id;
  	const quan = this.state[key];
  	console.log(quan);
  	console.log(deadline);
  	if(quan.toJSON() <= deadline) {
  		alert(
        		"Your are required to select a datetime which is only after the existing one."
      		);
      		return;
  	}
  	console.log(id);
  	axios
  		.post("http://localhost:4000/jobs/edit3", {
  			id: id, 
  			deadline: quan
  		})
  		.then(res => {
  			axios
          		.post("http://localhost:4000/jobs/seller", {
          		  sellerID: this.state.userData.id
          		})
          		.then(res => {
          		  this.setState({
          		    jobs: res.data
          		  });
          		  alert("Edited Succesfully");
          		})
          		.catch(err => {
          		  console.log(err);
          		});
  		})
  		.catch(err => {
  			console.log(err);
  		});
  }
  
  quanChange(event, id, newQuantity, newQuantityRemaining)
  {
  	const key = "position" + id;
  	const quan = this.state[key];
  	console.log(quan);
  	newQuantityRemaining = Number(newQuantityRemaining) + Number(quan) - Number(newQuantity);
  	if(newQuantityRemaining < 0)
  	{
  		alert(
        		"Your required no.of max applications should exceed the number of applications applied."
      		);
      		return;
  	} 
  	newQuantity=quan;
  	console.log(id);
  	axios
  		.post("http://localhost:4000/jobs/edit2", { 
  			id: id, 
  			newpos: newQuantity, 
  			newposRemaining: newQuantityRemaining.toString()
  		})
  		.then(res => {
  			axios
          		.post("http://localhost:4000/jobs/seller", {
          		  sellerID: this.state.userData.id
          		})
          		.then(res => {
          		  this.setState({
          		    jobs: res.data
          		  });
          		  alert("Edited Succesfully");
          		})
          		.catch(err => {
          		  console.log(err);
          		});
  		})
  		.catch(err => {
  			console.log(err);
  		});
  }
  
  handleQuantity(event, id) {
    const { value } = event.target;
    console.log(value);
    const key = "quantity" + id;
    console.log(key);
    this.setState({
      [key]: value
    });
    console.log(this.state);
  }
  
  handlePosition(event, id) {
    const { value } = event.target;
    console.log(value);
    const key = "position" + id;
    console.log(key);
    this.setState({
      [key]: value
    });
    console.log(this.state);
  }
  
  handleDeadline(event, id) {
    const { date } = event.target;
    const key = "deadline"+id ;
    console.log(key);
    this.setState({
      [key]: date
    });
    console.log(this.state);
  }
  
  getRedirect(event, id) {
  event.preventDefault();
  console.log(id);	
  	this.props.history.push("/recruiter/"+id);
  }

  render() {
    const { classes } = this.props;

    const styles = {
      errorColor: {
        color: this.state.color
      }
    };

    let rows = [];

    for (var i = 0; i < this.state.jobs.length; i++) {
      rows.push(
        createData(
          this.state.jobs[i]._id,
          this.state.jobs[i].name,
          this.state.jobs[i].postDate,
          this.state.jobs[i].quantity,
          this.state.jobs[i].quantityRemaining,
          this.state.jobs[i].pos,
          this.state.jobs[i].posRemaining,
          this.state.jobs[i].deadline
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
              <Link variant="button" href="#" className={classes.link}>
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
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Date of Posting</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell align="center">Edit Quantity</StyledTableCell>
                <StyledTableCell align="right">Edit ?</StyledTableCell>
                <StyledTableCell align="right">
                  Remaining Quantity
                </StyledTableCell>
                <StyledTableCell align="right">Positions</StyledTableCell>
  		<StyledTableCell align="right">Edit Positions</StyledTableCell>
                <StyledTableCell align="right">Edit ?</StyledTableCell>
                <StyledTableCell align="right">
                  Remaining Positions
                </StyledTableCell>
                
                <StyledTableCell align="right">Deadline</StyledTableCell>
  		<StyledTableCell align="right">Edit deadline</StyledTableCell>
                <StyledTableCell align="right">Edit ?</StyledTableCell>
                <StyledTableCell align="right">Cancel ?</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                   <Button
                        variant="contained"
                        onClick={e =>
                          this.getRedirect(e, row.id)
                        }
                      >
                    {row.name}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">{moment(row.postDate).format('DD-MM-YYYY')}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                        <form
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                          onChange={e => this.handleQuantity(e, row.id)}
                        >
                          <TextField id="standard-basic" label="New Quantity" />
                        </form>
                      </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      name="isCancelled"
                      onClick={e => this.posChange(e, row.id, row.quantity, row.quantityRemaining)}
                    >
                      Edit
                    </Button>
                  </StyledTableCell>
                  
                  <StyledTableCell align="right">
                    {row.quantityRemaining}
                  </StyledTableCell>
                  
                  <StyledTableCell component="th" scope="row">
                    {row.pos}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                        <form
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                          onChange={e => this.handlePosition(e, row.id)}
                        >
                          <TextField id="standard-basic" label="New Positions" />
                        </form>
                      </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      name="isCancelled"
                      onClick={e => this.quanChange(e, row.id, row.pos, row.posRemaining)}
                    >
                      Edit
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.posRemaining}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {moment(row.deadline).format('DD-MM-YYYY|HH:mm:ss')}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                        <DateTimePicker
      				name="deadline"
      				value={this.state["deadline" + row.id]}
        			onChange={(date) => this.setState({["deadline"+row.id]: date})}
      			/>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      name="isCancelled"
                      onClick={e => this.deadlineChange(e, row.id, row.deadline)}
                    >
                      Edit
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="secondary"
                      name="isCancelled"
                      onClick={e => this.handleChange(e, row.id)}
                    >
                      Cancel
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RecruiterView));
