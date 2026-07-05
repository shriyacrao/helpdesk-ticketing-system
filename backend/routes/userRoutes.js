const express = require('express');
const router = express.Router();
const { getUsers, getAgents, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.get('/', roleCheck('admin'), getUsers);
router.get('/agents', roleCheck('admin', 'agent'), getAgents);
router.put('/:id/role', roleCheck('admin'), updateUserRole);

module.exports = router;
