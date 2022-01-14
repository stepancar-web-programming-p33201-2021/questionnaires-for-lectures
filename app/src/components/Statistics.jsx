import React, { Component } from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

class Statistics extends React.Component {
  render() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Статистика</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <>
            {this.props.quiz.statistics.map((stat) => {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid grey',
                    marginBottom: '15px',
                  }}
                  key={stat.name}
                >
                  <Typography id='transition-modal-title' component='p'>
                    {stat.name}
                  </Typography>
                  <Typography id='transition-modal-description' component='p'>
                    {stat.score}
                  </Typography>
                </Box>
              );
            })}
          </>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default Statistics;
