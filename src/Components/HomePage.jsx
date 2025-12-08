
import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import TaskHeader from './TaskHeader';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import ChartCard from './ChartCard';
import '../App.css';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';

const HomePage = () => {
  const [open, setOpen] = useState(false); // task form modal
  const [editMode, setEditMode] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState('light');
  const [user,setUser] = useState(null) // Holds the logged in user object from the backend (or null initially)
  const [loggedIn,setLoggedIn] = useState(false) // a boolean to track if the user is logged in or not

  //  state for user/profile modal
  const [profileOpen, setProfileOpen] = useState(false);

  // Dark & Light Mode function
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: { default: '#fefee5', paper: '#fff' },
                text: { primary: '#1A1A1A', secondary: '#555' },
              }
            : {
                background: { default: '#0a072eff', paper: '#1c1e46c2' },
                text: { primary: '#E6E6FA', secondary: '#BDBDBD' },
                primary: { main: '#90caf9' },
              }),
        },
      }),
    [mode]
  );

  const getGoogleProfile = async()=>{
    try{
      console.log("Google profile data is calling...")
      // wait the response and store it in "res"
      const res = await fetch('http://localhost:8000/',{
        method:"GET",
        credentials:"include", //send
        headers:{
          "Content-Type":"application/json"
        }
      })
      console.log("res",res)
      const data = await res.json()
      console.log("GetGoogleProfile",data)
      console.log("user",data.user)
      console.log("data.loggedIn",data.loggedIn)
      setLoggedIn(data.loggedIn)
      if(data.loggedIn){
        console.log("user",data.user)
        setUser(data.user)
      }
    }catch(e){
      console.log("Failed to fetch Google Profile",e)
    }
  }

  useEffect(()=>{
    getGoogleProfile()
  },[])

  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (Array.isArray(savedTasks)) {
        setTasks(savedTasks);
      }
    } catch (e) {
      console.error('Failed to parse saved tasks', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleClickOpen = () => {
    setEditMode(false);
    setTaskId(null);
    setTaskName('');
    setTaskDescription('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setTaskId(null);
    setTaskName('');
    setTaskDescription('');
  };

  const handleSaveTask = () => {
    if (!taskName.trim()) return;

    if (editMode && taskId !== null) {
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, name: taskName, description: taskDescription }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        name: taskName,
        description: taskDescription,
        completed: false,
      };
      setTasks(prev => [...prev, newTask]);
    }

    handleClose();
  };

  const openEditModal = task => {
    setEditMode(true);
    setTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setOpen(true);
  };

  const handleDeleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCompleteTask = id => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Open') return !task.completed;
    if (filter === 'Closed') return task.completed;
    return true;
  });

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // 👇 handlers for profile modal
  const handleProfileOpen = () => setProfileOpen(true);
  const handleProfileClose = () => setProfileOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          paddingTop: '0px',
        }}
      >
        {/* Top bar: user + theme toggle */}
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px',
            alignItems: 'center',
            gap: 1.5,
            border:'3px solid red',
            paddingTop:'5px'
          }}
        >
          {/* User icon */}
          <FaUser
            size={20}
            style={{ color: 'rgba(249, 168, 6, 1)', cursor: 'pointer' }}
            onClick={handleProfileOpen}
          />

          {/* Light/Dark Theme */}
        <div onClick={toggleTheme} style={{ cursor: 'pointer', display: 'flex' }}>
          {mode === 'light' ? (
            <MdDarkMode style={{ fontSize: 24, color: 'rgba(23, 3, 94, 1)' }} />
          ) : (
            <MdLightMode style={{ fontSize: 24, color: 'rgba(247, 206, 5, 1)' }} />
          )}
        </div>
        </Container>

        {/* Task card */}
        <Container
          maxWidth="sm"
          sx={{
            borderRadius: '16px',
            padding: '24px',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          <TaskHeader
            handleClickOpen={handleClickOpen}
            onFilterChange={setFilter}
            currentFilter={filter}
          />

          <Divider sx={{ marginBottom: '16px' }} />

          <TaskList
            tasks={filteredTasks}
            handleCompleteTask={handleCompleteTask}
            openEditModal={openEditModal}
            handleDeleteTask={handleDeleteTask}
          />

          <TaskForm
            open={open}
            handleClose={handleClose}
            taskName={taskName}
            taskDescription={taskDescription}
            setTaskName={setTaskName}
            setTaskDescription={setTaskDescription}
            handleSave={handleSaveTask}
            editMode={editMode}
          />
        </Container>

        {/* Chart card */}
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ChartCard tasks={tasks} />
        </Container>

        {/*  User/Profile Modal */}
        <Dialog open={profileOpen} onClose={handleProfileClose}>
          <DialogTitle style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
            <FaUser style={{size:"20px",color:"orange"}}/>Account Detail</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
            {loggedIn === true ? (
        user ? (
          <div>
            <p>Google Id: {user.googleId}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>

            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          </div>
        ) : (
          <p>Loading user...</p>
        )
      ) : (
        <p>Not logged in</p>
      )}
       </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProfileClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
