import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Typography,
  Popover,
  Grow,
} from '@mui/material';
import TaskHeader from './TaskHeader';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import ChartCard from './ChartCard';
import '../App.css';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const HomePage = () => {
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // task form modal
  const [editMode, setEditMode] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState('light');
  const [user, setUser] = useState(null); // Holds the logged in user object from the backend (or null initially)
  const [loggedIn, setLoggedIn] = useState(false); // a boolean to track if the user is logged in or not

  // state for user/profile dropdown (MongoDB-style)
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

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

  const getGoogleProfile = async () => {
    try {
      console.log('Google profile data is calling...');
      const res = await fetch('http://localhost:8000/', {
        method: 'GET',
        credentials: 'include', //send cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('res', res);
      const data = await res.json();
      console.log('GetGoogleProfile', data);
      console.log('user', data.user);
      console.log('data.loggedIn', data.loggedIn);
      setLoggedIn(data.loggedIn);
      if (data.loggedIn) {
        console.log('user', data.user);
        setUser(data.user);
      }
    } catch (e) {
      console.log('Failed to fetch Google Profile', e);
    }
  };

  useEffect(() => {
    getGoogleProfile();
  }, []);

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

 const handleProfileOpen = event => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = async() => {
    try{
      const res = await fetch('http://localhost:8000/sign-out',{
        method:'POST',
        credentials:'include',//send cookies so backend can clear them
        headers:{
          'Content-Type':'application/json'
        }
      })

      console.log("response",res)
      if(res.ok){
        //clear frontend state
        setLoggedIn(false);
        setUser(null)
        handleProfileClose()
        toast.info("Successfully Sign-out")
        navigate('/sign-in')
      }else{
        const data = await res.json().catch(()=>({}))
        console.error('Sign-out failed:',data)
      }
    }catch(e){
      console.error('Signed-out error:',e)
    }
  };

  const isProfileOpen = Boolean(profileAnchorEl);

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
            border: '3px solid red',
            paddingTop: '5px',
          }}
        >
          {/* User icon (MongoDB-style dropdown anchor) */}
          <Box
            onClick={handleProfileOpen}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'rgba(249, 168, 6, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <FaUser
              size={18}
              style={{ color: 'rgba(249, 168, 6, 1)' }}
            />
          </Box>

          {/* Light/Dark Theme */}
          <div
            onClick={toggleTheme}
            style={{ cursor: 'pointer', display: 'flex' }}
          >
            {mode === 'light' ? (
              <MdDarkMode
                style={{ fontSize: 24, color: 'rgba(23, 3, 94, 1)' }}
              />
            ) : (
              <MdLightMode
                style={{ fontSize: 24, color: 'rgba(247, 206, 5, 1)' }}
              />
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

        {/* User/Profile Dropdown (MongoDB-style) */}
        <Popover
          open={isProfileOpen}
          //anchorEl is the DOM element the popover is anchored to – in this case, the user icon in the top-right.
          anchorEl={profileAnchorEl}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          //Grow is a transition component provided by MUI.It animates:opacity (fade in/out) and scale (slightly zoom in/out)
          TransitionComponent={Grow}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
              py: 2,
              minWidth: 240,
            },
          }}
        >
          <Box>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                px:2,
              }}
            >
              <FaUser size={18} style={{ color: 'orange' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Account Detail
              </Typography>
            </Box>

            {/* Body */}
            {/* variant="body2" // the font size 
            // Use a <div> tag under the hood instead of <p>,but keep all the Typography styling for variant="body2"*/}
            <Typography variant="body2" component="div"
            sx={{px:2}}>
              
              {loggedIn === true ? (
                user ? (
                  <div >
                    <p>Google Id: {user.googleId}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                  </div>
                ) : (
                  <p>Loading user...</p>
                )
              ) : (
                <p>Not logged in</p>
              )}
            </Typography>

           <Button
            onClick={handleSignOut}
            fullWidth
            size="small"
            sx={{
              mt: 1.5,
              // border:'2px solid red',
              justifyContent: 'flex-start',
              borderRadius: 1,
              px: 1.5,
              mx:0,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            Sign out
          </Button>
          </Box>
        </Popover>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
