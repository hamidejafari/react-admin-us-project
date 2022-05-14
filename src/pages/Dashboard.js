import React from "react";

import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CategoryIcon from "@mui/icons-material/Category";
import ShieldIcon from "@mui/icons-material/Shield";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 20,
  fontSize: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#283593",
}));

const UserGet = () => {
  return (
    <React.Fragment>
      <Grid
        className={"row"}
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} md={6} lg={3}>
          <Item className={"Item"}>
            <AutoAwesomeMotionIcon
              className={"icon"}
              style={{ fontSize: "40px", marginRight: "5px" }}
            />
            Products
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Item className={"Item"}>
            <CategoryIcon
              className={"icon"}
              style={{ fontSize: "40px", marginRight: "5px" }}
            />
            Categories
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Item className={"Item"}>
            <ShieldIcon
              className={"icon"}
              style={{ fontSize: "40px", marginRight: "5px" }}
            />
            Brands
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Item className={"Item"}>
            <PeopleAltIcon
              className={"icon"}
              style={{ fontSize: "40px", marginRight: "5px" }}
            />
            Users
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default UserGet;
