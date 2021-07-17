/* eslint-disable prettier/prettier */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-control-regex */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from "react";
import "./Ledger.css";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import axios from "axios";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: `http://localhost:8080`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic YWRtaW46c2VjcmV0`,
    Accept: "application/json",
  },
});

function Ledger() {
  var columns = [
    { title: "Customer ID", field: "_id.customer" },
    {
      title: "Avatar",
      render: (rowData) => (
        <Avatar
          maxInitials={1}
          size={40}
          round={true}
          name={rowData === undefined ? " " : rowData._id.first_name}
        />
      ),
    },
    { title: "First name", field: "_id.first_name" },
    { title: "Last name", field: "_id.last_name" },
    {
      title: "Credit",
      type: "numeric",
      field: "credit",
      render: (rowData) => rowData.credit.toLocaleString(),
    },
    {
      title: "Debit",
      type: "numeric",
      field: "debit",
      render: (rowData) => rowData.debit.toLocaleString(),
    },
    {
      title: "Balance",
      type: "numeric",
      render: (rowData) => (rowData.credit - rowData.debit).toLocaleString(),
    },
  ];
  const [data, setData] = useState([]);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  useEffect(() => {
    api
      .get("/transactions/_aggrs/totalbalance?count")
      .then((res) => {
        setCredit(res.data[0].credit);
        setDebit(res.data[0].debit);
        resolve();
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const styles = {
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
    },
    option: {
      fontSize: 15,
      "& > span": {
        marginRight: 10,
        fontSize: 18,
      },
    },
  };
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <div className="Ledger">
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <GridItem xs={6} sm={6} md={6}>
                  <h4 className={classes.cardTitleWhite}>Ledger Balance</h4>
                </GridItem>
              </CardHeader>
              <CardBody>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <MaterialTable
                      title=""
                      columns={columns}
                      data={(query) =>
                        new Promise((resolve, reject) => {
                          let url =
                            "http://localhost:8080/transactions/_aggrs/ledgerbalance?rep=hal";
                          url += "&pagesize=" + query.pageSize;
                          url += "&page=" + (query.page + 1);
                          // if (query.search !== "") {
                          url +=
                            "&avars={'first_name':/.*" + query.search + "/}}";
                          // }
                          fetch(url, {
                            headers: {
                              authorization: `Basic YWRtaW46c2VjcmV0`,
                            },
                          })
                            .then((response) => response.json())
                            .then((result) => {
                              let data = [];
                              if (result.hasOwnProperty("_embedded"))
                                data = result._embedded["rh:result"];

                              let totalCount;
                              if (result._returned === query.pageSize) {
                                totalCount =
                                  result._returned * (query.page + 1) + 1;
                              } else {
                                totalCount = query.pageSize * (query.page + 1);
                              }

                              resolve({
                                data: data,
                                page: query.page,
                                totalCount: totalCount,
                              });
                            });
                        })
                      }
                      icons={tableIcons}
                      options={{
                        exportAllData: true,
                        exportButton: true,
                        paginationType: "stepped",
                        emptyRowsWhenPaging: false,
                        actionsColumnIndex: 8,
                        pageSize: 5,
                        pageSizeOptions: [5, 10, 20],
                        toolbarButtonAlignment: "right",
                        rowStyle: {
                          fontWeight: 400,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardBody>
              <CardFooter>
                <Grid container spacing={1}>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Credit: <b>{credit.toLocaleString()}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Debit: <b>{debit.toLocaleString()}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Balance: <b>{(credit - debit).toLocaleString()}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

tableIcons.displayName = "tableIcons";

export default Ledger;
