import { Box, Typography, Button, Chip, useTheme } from '@mui/material';

const TaskHeader = ({ handleClickOpen, onFilterChange, currentFilter }) => {
  const handleChipClick = (filter) => {
    onFilterChange(filter);
  };

    const theme = useTheme(); // 

    //  define reusable chip colors
  const getChipStyles = (filter) => {
    const isSelected = currentFilter === filter;

    if (theme.palette.mode === "light") {
      return {
        backgroundColor: isSelected ? "#cee1fcff" : "#F3F4F6",
        color: isSelected ? "#1976d2" : "#333",
      };
    } else {
      return {
        backgroundColor: isSelected ? "#1b61b1ff" : "#2A2950",
        color: isSelected ? "white" : theme.palette.text.secondary,
      };
    }
  };

  return (
    <>
    
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">Today's Task</Typography>
        <Button 
          variant="contained" 
          sx={{ borderRadius: '12px', backgroundColor: '#E0EDFF', color: '#1976d2' ,'&:hover': {
      backgroundColor: '#C5DAFF', 
    }, }}
          onClick={handleClickOpen}
        >
          + New Task
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>

      </Typography>

      <Box display="flex" alignItems="center" sx={{ marginBottom: '16px' }}>
        <Chip 
          label="All" 
          // color={currentFilter === 'All' ? 'primary' : 'default'}
          sx={{ mr: 1.5, px: 1, ...getChipStyles("All")
                    ,'&:hover': {
              backgroundColor: '#b9d5ffff', 
            },
           }}
          onClick={() => handleChipClick('All')}
        />
        <Chip 
          label="Open" 
          // color={currentFilter === 'Open' ? 'primary' : 'default'}
            sx={{ mr: 1.5, ...getChipStyles("Open")
                  ,'&:hover': {
              backgroundColor: '#b9d5ffff', 
            },
              }}
          onClick={() => handleChipClick('Open')}
        />
        <Chip 
          label="Closed" 
          // color={currentFilter === 'Closed' ? 'primary' : 'default'}
            sx={{ ...getChipStyles("Closed") 
                   ,'&:hover': {
              backgroundColor: '#b9d5ffff', 
            },
            }}
          onClick={() => handleChipClick('Closed')}
        />
      </Box>
    </>
  );
};

export default TaskHeader;
