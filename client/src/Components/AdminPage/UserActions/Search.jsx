import { useState } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Button,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { filterUsers } from "../../../Redux/functions/userFunctions";

const Search = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState([]);
  const [city, setCity] = useState([]);
  const [department, setDepartment] = useState([]);
  const [gender, setGender] = useState([""]);
  const [date, setDate] = useState([null, "after"]);

  const handleSubmit = () => {
    console.log(city.length);
    var values = {};
    if (name.length !== 0 && name[0] !== "") {
      values.name = name;
    } else {
      delete values.name;
    }
    if (city.length !== 0 && city[0] !== "") {
      values.city = city;
    }
    if (department.length !== 0 && department[0] !== "") {
      values.department = department;
    }
    if (gender[0] !== "") {
      values.gender = gender;
    }
    if (date[0] !== null) {
      values.date_created = date;
    }
    console.log(values);
    dispatch(filterUsers(values));
  };

  return (
    <Grid container columnGap={3}>
      <Grid item xs>
        <TextField
          label='Name'
          variant='outlined'
          value={name && name.join(" ")}
          onChange={(e) => {
            setName(e.target.value.split(" "));
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id='genderId'>Gender</InputLabel>
          <Select
            label='Gender'
            labelId='genderId'
            value={gender[0]}
            onChange={(e) => setGender([e.target.value])}
          >
            <MenuItem value='M'>Male</MenuItem>
            <MenuItem value='F'>Female</MenuItem>
            <MenuItem value='O'>Prefer not to say</MenuItem>
            <MenuItem value=''>Clear</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs>
        <TextField
          label='City'
          variant='outlined'
          value={city && city.join(" ")}
          onChange={(e) => {
            setCity(e.target.value.split(" "));
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          label='Department'
          variant='outlined'
          value={department && department.join(" ")}
          onChange={(e) => {
            setDepartment(e.target.value.split(" "));
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            label='Date desktop'
            inputFormat='DD/MM/YYYY'
            value={date[0]}
            onChange={(e) => {
              setDate((prev) => [e, prev[1]]);
              console.log(date[0].format("DD-MM-YYYY"));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id='zoneId'>Zone</InputLabel>
          <Select
            label='Gender'
            labelId='zoneId'
            value={date[1]}
            onChange={(e) => setDate((prev) => [prev[0], e.target.value])}
          >
            <MenuItem value='before'>Before</MenuItem>
            <MenuItem value='after'>After</MenuItem>
            <MenuItem value='at'>At</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Button onClick={handleSubmit} variant='contained'>
        Search
      </Button>
    </Grid>
  );
};

export default Search;
