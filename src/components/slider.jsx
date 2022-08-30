//Obtained from MUI, https://mui.com/material-ui/react-app-bar/#app-bar-with-a-primary-search-field
import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function DiscreteSlider(props) {

  return (
    <Box sx={{ width: 200, backgroundColor:"white", borderRadius: '16px', marginTop:'2%', marginBottom:'2%', marginRight:'1%', marginLeft:'1%', paddingLeft:'1%', paddingRight:'1%'}}>
      <Slider
        aria-label="Transactions"
        defaultValue={5}
        getAriaValueText={(v) => {props.handleBar(v)}}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={3}
        max={10}
        disabled={props.activate}
      />
    </Box>
  );

}
