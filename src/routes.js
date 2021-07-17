/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import TableChartIcon from "@material-ui/icons/TableChart";

import CustomerList from "views/CustomerList/CustomerList";
import Ledger from "views/Ledger/Ledger";
import Transactions from "views/Transactions/Transactions";

const dashboardRoutes = [
  {
    path: "/customerlist",
    name: "Customers",
    rtlName: "قائمة الجدول",
    icon: Person,
    component: CustomerList,
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions",
    rtlName: "قائمة الجدول",
    icon: TableChartIcon,
    component: Transactions,
    layout: "/admin",
  },
  {
    path: "/ledger",
    name: "Ledger",
    rtlName: "قائمة الجدول",
    icon: ChromeReaderModeIcon,
    component: Ledger,
    layout: "/admin",
  },
];

export default dashboardRoutes;
