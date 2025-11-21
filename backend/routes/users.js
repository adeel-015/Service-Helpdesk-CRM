const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  updateUserRoleValidation,
  getAllUsersValidation,
  validate,
} = require("../middleware/validation");
const {
  profileUpdateValidation,
  changePasswordValidation,
} = require("../middleware/validation");

router.use(authenticate);

router.get("/agents", authorize("admin", "agent"), UserController.getAllAgents);
router.get(
  "/",
  authorize("admin"),
  getAllUsersValidation,
  validate,
  UserController.getAllUsers
);
router.put(
  "/:id/role",
  authorize("admin"),
  updateUserRoleValidation,
  validate,
  UserController.updateUserRole
);

// Admin delete user
router.delete("/:id", authorize("admin"), async (req, res, next) => {
  return UserController.deleteUser(req, res, next);
});

// Profile routes for current user
router.get("/profile", UserController.getProfile);
router.put(
  "/profile",
  profileUpdateValidation,
  validate,
  UserController.updateProfile
);
router.put(
  "/profile/password",
  changePasswordValidation,
  validate,
  UserController.changePassword
);

module.exports = router;
