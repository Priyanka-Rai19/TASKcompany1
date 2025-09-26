import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// here setting Middleware/////.
app.use(cors());
app.use(express.json());
///Here using map for fetch data////
const users = new Map(); //  It stores user data: id -> {id, username, email}
const tasks = new Map(); // It stores task data: id -> {id, title, description, priority, status, assignedTo, dependencies, createdBy}
let userIdCounter = 1;
let taskIdCounter = 1;

/**
 * Mock Authentication Middleware
 * Simple token-based auth for development purposes
 */



const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    console.log(token)
    const user = Array.from(users.values()).find(u => u.username === token);

    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
};

/**
 * USER ROUTES
 */

// Create a new user
app.post('/api/users/register', (req, res) => {
    try {
        const { username, email } = req.body;

        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        // Check if user already exists
        const existingUser = Array.from(users.values()).find(
            u => u.username === username || u.email === email
        );

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser = {
            id: userIdCounter++,
            username,
            email,
            createdAt: new Date().toISOString()
        };

        users.set(newUser.id, newUser);

        res.status(201).json({
            user: newUser,
            token: username // Simple token = username for mock auth
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login user (mock authentication)
app.post('/api/users/login', (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find user by username
        const user = Array.from(users.values()).find(u => u.username === username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user,
            token: username // Simple token = username for mock auth
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get all users
app.get('/api/users', authenticateUser, (req, res) => {
    try {
        const allUsers = Array.from(users.values());
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users' });
    }
});

/**
 * TASK ROUTES
 */

// Helper function to check if task dependencies are complete
const areDependenciesComplete = (taskId) => {
    const task = tasks.get(taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
        return true;
    }

    // Check if all dependency tasks are completed
    return task.dependencies.every(depId => {
        const depTask = tasks.get(depId);
        return depTask && depTask.status === 'Done';
    });
};

// Helper function to check if task is blocked
const isTaskBlocked = (taskId) => {
    return !areDependenciesComplete(taskId);
};

// Create a new task
app.post('/api/tasks', authenticateUser, (req, res) => {
    try {
        const { title, description, priority, assignedTo, dependencies } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Validate priority
        const validPriorities = ['Low', 'Medium', 'High'];
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority' });
        }

        // Validate assigned user exists
        if (assignedTo && !users.has(assignedTo)) {
            return res.status(400).json({ error: 'Assigned user does not exist' });
        }

        // Validate dependencies exist
        if (dependencies && dependencies.length > 0) {
            const invalidDeps = dependencies.filter(depId => !tasks.has(depId));
            if (invalidDeps.length > 0) {
                return res.status(400).json({ error: 'Some dependencies do not exist' });
            }
        }

        // Create new task
        const newTask = {
            id: taskIdCounter++,
            title,
            description: description || '',
            priority: priority || 'Low',
            status: 'To Do',
            assignedTo: assignedTo || null,
            dependencies: dependencies || [],
            createdBy: req.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasks.set(newTask.id, newTask);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks (with optional filtering)
app.get('/api/tasks', authenticateUser, (req, res) => {
    try {
        const { priority, status, assignedTo, blocked } = req.query;
        let filteredTasks = Array.from(tasks.values());

        // Apply filters
        if (priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === priority);
        }

        if (status) {
            filteredTasks = filteredTasks.filter(task => task.status === status);
        }

        if (assignedTo) {
            filteredTasks = filteredTasks.filter(task => task.assignedTo === parseInt(assignedTo));
        }

        if (blocked === 'true') {
            filteredTasks = filteredTasks.filter(task => isTaskBlocked(task.id));
        }

        // Add blocked status to each task
        const tasksWithBlockedStatus = filteredTasks.map(task => ({
            ...task,
            isBlocked: isTaskBlocked(task.id)
        }));

        res.json(tasksWithBlockedStatus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// Get tasks assigned to current user
app.get('/api/tasks/my-tasks', authenticateUser, (req, res) => {
    try {
        const userTasks = Array.from(tasks.values())
            .filter(task => task.assignedTo === req.user.id)
            .map(task => ({
                ...task,
                isBlocked: isTaskBlocked(task.id)
            }));

        res.json(userTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user tasks' });
    }
});

// Get blocked tasks
app.get('/api/tasks/blocked', authenticateUser, (req, res) => {
    try {
        const blockedTasks = Array.from(tasks.values())
            .filter(task => isTaskBlocked(task.id))
            .map(task => ({
                ...task,
                isBlocked: true
            }));

        res.json(blockedTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get blocked tasks' });
    }
});

// for Updating a task
app.put('/api/tasks/:id', authenticateUser, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = tasks.get(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const { title, description, priority, status, assignedTo, dependencies } = req.body;

        // Validate priority if provided
        const validPriorities = ['Low', 'Medium', 'High'];
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority' });
        }

        // Validate status if provided
        const validStatuses = ['To Do', 'In Progress', 'Done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Check if task can be marked as complete
        if (status === 'Done' && isTaskBlocked(taskId)) {
            return res.status(400).json({ error: 'Cannot complete task: dependencies are not complete' });
        }

        // Validate assigned user exists
        if (assignedTo !== undefined && assignedTo !== null && !users.has(assignedTo)) {
            return res.status(400).json({ error: 'Assigned user does not exist' });
        }

        // Update task fields
        const updatedTask = {
            ...task,
            title: title !== undefined ? title : task.title,
            description: description !== undefined ? description : task.description,
            priority: priority !== undefined ? priority : task.priority,
            status: status !== undefined ? status : task.status,
            assignedTo: assignedTo !== undefined ? assignedTo : task.assignedTo,
            dependencies: dependencies !== undefined ? dependencies : task.dependencies,
            updatedAt: new Date().toISOString()
        };

        tasks.set(taskId, updatedTask);

        // Add blocked status
        const taskWithBlockedStatus = {
            ...updatedTask,
            isBlocked: isTaskBlocked(taskId)
        };

        res.json(taskWithBlockedStatus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', authenticateUser, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        if (!tasks.has(taskId)) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Check if any other tasks depend on this task
        const dependentTasks = Array.from(tasks.values()).filter(
            task => task.dependencies && task.dependencies.includes(taskId)
        );

        if (dependentTasks.length > 0) {
            return res.status(400).json({
                error: 'Cannot delete task: other tasks depend on it',
                dependentTasks: dependentTasks.map(t => t.title)
            });
        }

        tasks.delete(taskId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Smart Task Manager server running on http://localhost:${PORT}`);

    // Create some demo users for testing
    const demoUsers = [
        { username: 'Divyansh_kamlesh', email: 'Divyanshkamlesh@example.com' },
        { username: 'Devendra_patel', email: 'Devendrapatel@example.com' }
    ];

    demoUsers.forEach(userData => {
        const user = {
            id: userIdCounter++,
            username: userData.username,
            email: userData.email,
            createdAt: new Date().toISOString()
        };
        users.set(user.id, user);
    });

    console.log('Demo users created:', demoUsers.map(u => u.username));
});