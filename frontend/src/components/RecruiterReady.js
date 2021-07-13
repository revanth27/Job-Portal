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

class RecruiterReady extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: "",
      products: {}
    };

    this.handleChange = this.handleChange.bind(this);
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

          if (res.data.type === "applicant") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log("mine", this.state);

          axios
            .post("http://localhost:4000/products/ready", {
              sellerID: this.state.userData.id
            })
            .then(resp => {
              console.log("data", resp.data);
              console.log("id", this.state.userData.id);
              this.setState({
                products: resp.data
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

  handleChange(event, id) {
    console.log(id);
    axios
      .post("http://localhost:4000/products/dispatch", { id: id })
      .then(res => {
        console.log("dispatched");
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      products: this.state.products.filter(product => product._id != id)
    });
  }

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  render() {
    const { classes } = this.props;

    const styles = {
      errorColor: {
        color: this.state.color
      }
    };

    let rows = [];

    for (var i = 0; i < this.state.products.length; i++) {
      rows.push(
        createData(
          this.state.products[i]._id,
          this.state.products[i].name,
          this.state.products[i].salary,
          this.state.products[i].quantity
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
              Bulk Purchase App
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
                Ready to Dispatch
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/recruiter/dispatched"
                className={classes.link}
              >
                Dispatched
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
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell align="right">Salary</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>

                <StyledTableCell align="right">Dispatch ?</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.salary}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      name="isReady"
                      onClick={e => this.handleChange(e, row.id)}
                    >
                      Dispatch
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

export default withRouter(withStyles(styles)(RecruiterReady));
