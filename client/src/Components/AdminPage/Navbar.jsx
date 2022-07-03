import { useState, useEffect } from "react";
import { Grid, Typography, Box, Container, Stack, Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../Redux/reducers/admin";

const Navbar = ({ setOptionAdd }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAdd = () => {
    setOptionAdd(true);
  };
  return (
    <>
      {/* <OptionAdd optionAdd={optionAdd} /> */}
      <Box sx={{ px: 3 }}>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={9}>
            <Typography variant='h4'>Admin Page</Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<IoMdAddCircle />}
              onClick={handleAdd}
            >
              Add Person
            </Button>
          </Grid>
          <Grid item xs>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => dispatch(logOut())}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Navbar;
