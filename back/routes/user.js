const router = require('express').Router();
const authController = require('../controllers/auth.js');
const userController = require('../controllers/user.js');

// auth
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// user
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser);

module.exports = router;