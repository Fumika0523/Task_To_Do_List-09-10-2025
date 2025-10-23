import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";

const TaskForm = ({
  open,
  handleClose,
  taskName,
  taskDescription,
  setTaskName,
  setTaskDescription,
  handleSave,
  editMode,
}) => {
  const [nameError, setNameError] = useState(false);
  const theme = useTheme(); // 👈 access current theme

  const validateTaskName = (name) => {
    if (!name.trim()) {
      setNameError(true);
      return false;
    }
    setNameError(false);
    return true;
  };

  const onSave = () => {
    if (validateTaskName(taskName)) {
      handleSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px",
          backgroundColor: theme.palette.background.paper, // 👈 dynamic background
          color: theme.palette.text.primary, // 👈 dynamic text color
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
          padding: "8px 24px",
          bgcolor: theme.palette.background.paper, // 👈 theme-based
          color: theme.palette.text.primary, // 👈 theme-based
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {editMode ? "Edit Task" : "Add New Task"}
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "24px",
          bgcolor: theme.palette.background.paper, // 👈 theme-based
          color: theme.palette.text.primary, /// 👈 dynamic
        }}
      >
        <TextField
          autoFocus
          label="Task Name"
          fullWidth
          size="small"
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            validateTaskName(e.target.value);
          }}
          error={nameError}
          helperText={nameError ? "Task name is required" : ""}
          sx={{
            margin: "9px 0px 12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        <TextField
          label="Description"
          fullWidth
          size="small"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          sx={{
            marginBottom: "0px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          padding: "7px 16px",
          bgcolor: theme.palette.background.paper, // 👈 from theme
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: theme.palette.primary.main, // 👈 theme color
            textTransform: "none",
            borderRadius: "12px",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: "none",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {editMode ? "Update Task" : "Add Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
