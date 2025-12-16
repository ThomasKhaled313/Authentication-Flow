const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/RoleMiddleware')
const userController = require('../controllers/user.controllers')
const { validateUpdateProfile, validateDeleteProfile } = require('../validators/users.validators');
const userRoles = require('../utils/userRoles');
router.route('/')
        .get(authMiddleware, roleMiddleware(userRoles.ADMIN), userController.getAllUsersController)


router.route('/profile')
    .get(authMiddleware,userController.getProfileController)

router.route('/profile/update')
    .patch(authMiddleware, validateUpdateProfile, userController.updateProfileController)

router.route('/delete/me')
    .delete(authMiddleware, validateDeleteProfile, userController.deleteProfileController)    

module.exports = router;    