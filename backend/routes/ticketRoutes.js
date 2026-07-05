const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getStats,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats/summary', getStats);
router.route('/').post(createTicket).get(getTickets);
router.route('/:id').get(getTicket).put(updateTicket).delete(deleteTicket);
router.post('/:id/comments', addComment);

module.exports = router;
