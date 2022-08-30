//Obtained from MUI, https://mui.com/material-ui/react-app-bar/#app-bar-with-a-primary-search-field
import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import DiscreteSlider from './slider.jsx';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export default function SearchAppBar(props) {

  const [input, setInput] = useState('');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <h5 style={{ color: 'white', textAlign:"center", alignItems:"center" }}>TRANSACTIONS PER NODE</h5>
          <DiscreteSlider handleBar={props.handleBar} activate={props.activate}/>
          <button type="button" className="btn btn-danger" onClick={props.clearFlow}>Clear</button>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
          </Typography>
          <h3>EXPLORE ADDRESS</h3>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              type="text"
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={e=>setInput(e.target.value)}
              onKeyPress={(e) =>{
                if (e.key === "Enter") {
                  props.handleEnter(e);
                }
              }}
            />
          </Search>
          <button type="button" className="btn btn-success" style={{marginLeft:"10px"}} onClick={() => {
            props.handleSubmit(input);
          }}>Enter</button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
