const bcrypt = require('bcrypt');
const User = require('../../models/User');

/**
 * Creates a new user in the DB
 */
const createUser = async (username, password) => {
    if (!isComplexCredentials(username, password)) {
        return { success: false, msg: "Username and password must be at least 4 chars, password must contain at least one number" };
    }
    if (!(await isUniqueUsername(username))) {
        return { success: false, msg: "Username is taken! Choose another" };
    }

    // Creates and stores user
    const user = new User({
        username: username,
        passwordHash: await hashPassword(password), 
        dateCreated: new Date(Date.now())
    });
    await user.save();
    
    return { success: true, msg: "User created" };
}

/**
 * Checks the user's login credentials
 */
const login = async (req, username, password) => {
    const user = await User.findOne({username: username});
    if (user == undefined) return false;
    if (await checkPassword(password, user.passwordHash)) {
        // Update user's login status
        req.session.login = true;
        return true;
    }
    return false;
}

/**
 * Checks for username collisions
 */
const isUniqueUsername = async (username) => {
    try {
        const match = await User.findOne({ username: username });
        if (match) return false;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Checks credentials for length and complexity
 */
const isComplexCredentials = (username, password) => {
    try {
        // Checks for length of 4+ chars
        const usernameStrength = new RegExp(/^.{4,}$/);
        // Checks for length of 4+ chars and contains 1+ number
        const passwordStrength = new RegExp(/^(?=.*[0-9]).{4,}$/);
        if (usernameStrength.test(username) && passwordStrength.test(password)) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Hashes and salted inputted password using bcrypt
 */
const hashPassword = async (password) => {
    // Configurable salt rounds, default is 10
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash
}

/**
 * Checks inputted password against inputted password hash using bcrypt
 */
const checkPassword = async (password, passwordHash) => {
    const match = await bcrypt.compare(password, passwordHash);
    return match;
}

module.exports = {
    createUser,
    login
}