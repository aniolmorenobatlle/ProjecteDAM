const { Router } = require('express');
const { fetchLists, fetchAddList } = require('../controllers/listController.js');

const router = Router();

router.get('/:user_id', fetchLists);

router.post('/addList', fetchAddList);

module.exports = router;