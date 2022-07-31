const router = require('express').Router();
const {
  getUserMe, updateUserInfo,
} = require('../controllers/users');

const { updateUserInfoValidation } = require('../middlewares/validation');

router.get('/me', getUserMe);
router.patch('/me', updateUserInfoValidation, updateUserInfo);

module.exports = router;
