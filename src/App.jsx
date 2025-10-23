import { useState, useEffect, useMemo } from 'react';
import { Container, Box, Divider, ThemeProvider, createTheme, CssBaseline, Button } from '@mui/material';
import TaskHeader from './Components/TaskHeader';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';
import ChartCard from './Components/ChartCard'
import './App.css'
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";


const App = () => {

  const [open, setOpen] = useState(false); //open: controls if the modal (TaskForm) is visible.
  const [editMode, setEditMode] = useState(false); //editMode: whether the user is editing or adding a new task.
  const [taskId, setTaskId] = useState(null); //taskId: ID of the task being edited.
  const [taskName, setTaskName] = useState(''); //taskName & taskDescription: values from the input fields.
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]); //tasks: array of all task objects.
  const [filter, setFilter] = useState('All'); // New state for filter
  const [mode, setMode] = useState('light') // storing a current mode

const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        ...(mode === "light"
          ? {
              background: { default: "#fefee5", paper: "#fff" },
              text: { primary: "#1A1A1A", secondary: "#555" },
            }
          : {
              background: { default: "#0a072eff", paper: "#1c1e46c2" },
              text: { primary: "#E6E6FA", secondary: "#BDBDBD" },
              primary: { main: "#90caf9" },
            }),
      },
    }),
  [mode]
);



  useEffect(() => {
    //JSON.parse() converts a JSON string back into a JavaScript object or array.
    //Runs only once (because dependency array [] is empty).
    //Fetches saved tasks from browser storage and restores them.
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
 // console.log('tasks',tasks)
//Runs every time tasks changes.
//Saves the updated tasks list to localStorage.

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setTaskName('');
    setTaskDescription('');
  };

  const handleSaveTask = () => {
    
    if (editMode) {
      const taskToUpdate = tasks.find((element) => element.id === taskId);

      if (taskToUpdate) {
        console.log("Updating task:", taskToUpdate);
        
        const updatedTasks = tasks.map(task =>
          task.id === taskId
            ? { ...task, name: taskName, description: taskDescription }
            : task
        );
        setTasks(updatedTasks);
      } else {
        console.error("Task not found, unable to update.");
      }
    } else {
      // Adding new task
      const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
  
    handleClose();
  };
  
  const openEditModal = (task) => {
    setEditMode(true);
    setTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setOpen(true);
  };

  const handleDeleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Open') return !task.completed;
    if (filter === 'Closed') return task.completed;
  });

    const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  
 return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* applies background + text color */}
      <Box
        sx={{
          bgcolor: 'background.default', // background color now reacts to theme
          color: 'text.primary', // text color adjusts automatically
          minHeight: '100vh', // ensure full-screen background
          paddingTop: '20px',
        }}
      >
        <Container style={{display:'flex', justifyContent:"end", marginBottom:"10px"}}>
        <Button variant="text" onClick={toggleTheme}>
          {mode === 'light' ? (
            <MdDarkMode style={{ fontSize: 24, color: 'rgba(23, 3, 94, 1)' }} />
          ) : (
            <MdLightMode style={{ fontSize: 24, color: 'rgba(247, 206, 5, 1)' }} />
          )}
        </Button>

        </Container>

        <Container
          maxWidth="sm"
          sx={{
            borderRadius: '16px',
            padding: '24px',
            bgcolor: 'background.paper', // 🔥 use theme-based paper bg
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          <TaskHeader
            handleClickOpen={() => setOpen(true)}
            onFilterChange={setFilter}
            currentFilter={filter}
            
            
          />
          <Divider sx={{ marginBottom: '16px' }} />
          <TaskList
            tasks={tasks.filter((task) => {
              if (filter === 'All') return true;
              if (filter === 'Open') return !task.completed;
              if (filter === 'Closed') return task.completed;
            })}
            handleCompleteTask={(id) =>
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === id ? { ...t, completed: !t.completed } : t
                )
              )
            }
            openEditModal={(task) => {
              setEditMode(true);
              setTaskId(task.id);
              setTaskName(task.name);
              setTaskDescription(task.description);
              setOpen(true);
            }}
            handleDeleteTask={(id) =>
              setTasks((prev) => prev.filter((t) => t.id !== id))
            }
          />
          <TaskForm
            open={open}
            handleClose={() => {
              setOpen(false);
              setEditMode(false);
              setTaskName('');
              setTaskDescription('');
            }}
            taskName={taskName}
            taskDescription={taskDescription}
            setTaskName={setTaskName}
            setTaskDescription={setTaskDescription}
            handleSave={() => {
              if (editMode) {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId
                      ? { ...t, name: taskName, description: taskDescription }
                      : t
                  )
                );
              } else {
                setTasks((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    name: taskName,
                    description: taskDescription,
                    completed: false,
                  },
                ]);
              }
              setOpen(false);
            }}
            editMode={editMode}
          />
        </Container>

        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ChartCard tasks={tasks} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};


export default App;
