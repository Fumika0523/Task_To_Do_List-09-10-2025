import { useState, useEffect } from 'react';
import { Container, Box, Divider } from '@mui/material';
import TaskHeader from './Components/TaskHeader';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';
import ChartCard from './Components/ChartCard'

const App = () => {


  const [open, setOpen] = useState(false); //open: controls if the modal (TaskForm) is visible.
  const [editMode, setEditMode] = useState(false); //editMode: whether the user is editing or adding a new task.
  const [taskId, setTaskId] = useState(null); //taskId: ID of the task being edited.
  const [taskName, setTaskName] = useState(''); //taskName & taskDescription: values from the input fields.
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]); //tasks: array of all task objects.
  const [filter, setFilter] = useState('All'); // New state for filter

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

  return (
    <>
  <Box
  display="flex"
  flexDirection="column"
  justifyContent="flex-start"
  alignItems="center"
  minHeight="100vh"
  bgcolor="#fefee5ff"
  paddingTop="20px"
>
  <Container
    maxWidth="sm"
    sx={{
      borderRadius: '16px',
      padding: '24px',
      bgcolor: '#fff',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px'
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

  <Container
  
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // border: '2px solid #93f49fff',
    }}
  >
    <ChartCard tasks={tasks}/>
  </Container>
</Box>

</>
  );
};

export default App;
