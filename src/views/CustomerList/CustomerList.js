/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-control-regex */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from "react";
import "./CustomerList.css";
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
import Alert from "@material-ui/lab/Alert";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";

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

function validateEmail(email) {
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

function CustomerList() {
  var columns = [
    { title: "id", field: "id", hidden: true },
    {
      title: "Avatar",
      render: (rowData) => (
        <Avatar
          maxInitials={1}
          size={40}
          round={true}
          name={rowData === undefined ? " " : rowData.first_name}
        />
      ),
    },
    { title: "First name", field: "first_name" },
    { title: "Last name", field: "last_name" },
    { title: "Email", field: "email" },
    { title: "Address", field: "place" },
  ];
  const [data, setData] = useState([]); //table data
  const [page, setPage] = useState(1); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get("/customers?count&rep=hal")
      .then((res) => {
        setData(res.data._embedded["rh:doc"]);
        resolve({
          page: res._size,
          totalCount: res._size,
        });
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (newData.first_name === "") {
      errorList.push("Please enter first name");
    }
    if (newData.last_name === "") {
      errorList.push("Please enter last name");
    }
    if (newData.email === "" || validateEmail(newData.email) === false) {
      errorList.push("Please enter a valid email");
    }

    if (errorList.length < 1) {
      api
        .patch("/customers/" + newData._id.$oid, newData)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve({
            page: res._size,
            totalCount: res._size,
          });
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve({
        page: res._size,
        totalCount: res._size,
      });
    }
  };

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = [];
    if (newData.first_name === undefined) {
      errorList.push("Please enter first name");
    }
    if (newData.last_name === undefined) {
      errorList.push("Please enter last name");
    }
    if (newData.email === undefined || validateEmail(newData.email) === false) {
      errorList.push("Please enter a valid email");
    }

    if (errorList.length < 1) {
      //no error
      newData.created_on = { $date: Date.now() };
      api
        .post("/customers", newData)
        .then((res) => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve({
        page: res._size,
        totalCount: res._size,
      });
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete("/customers/" + oldData._id.$oid)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve({
          page: res._size,
          totalCount: res._size,
        });
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

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
    <div className="CustomerList">
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <GridItem xs={6} sm={6} md={6}>
                  <h4 className={classes.cardTitleWhite}>Customer List</h4>
                </GridItem>
              </CardHeader>
              <CardBody>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <div>
                      {iserror && (
                        <Alert severity="error">
                          {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>;
                          })}
                        </Alert>
                      )}
                    </div>
                    <MaterialTable
                      title=""
                      columns={columns}
                      data={(query) =>
                        new Promise((resolve, reject) => {
                          let url =
                            "http://localhost:8080/customers?count&rep=hal";
                          url += "&pagesize=" + query.pageSize;
                          url += "&page=" + (query.page + 1);
                          if (query.search !== "") {
                            url +=
                              "&filter={'first_name':{'$regex':'(?i)^" +
                              query.search +
                              ".*'}}";
                          }
                          fetch(url, {
                            headers: {
                              authorization: `Basic YWRtaW46c2VjcmV0`,
                            },
                          })
                            .then((response) => response.json())
                            .then((result) => {
                              let data = [];
                              if (result.hasOwnProperty("_embedded"))
                                data = result._embedded["rh:doc"];

                              resolve({
                                data: data,
                                page: query.page,
                                totalCount: result._size,
                              });
                            });
                        })
                      }
                      icons={tableIcons}
                      editable={{
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                          }),
                        onRowAdd: (newData) =>
                          new Promise((resolve) => {
                            handleRowAdd(newData, resolve);
                          }),
                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            handleRowDelete(oldData, resolve);
                          }),
                      }}
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
              <CardFooter></CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

tableIcons.displayName = "tableIcons";

export default CustomerList;
