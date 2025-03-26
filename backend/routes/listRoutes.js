const { Router } = require('express');
const { fetchLists, fetchAddList, fetchDeleteList, fetchListInfo } = require('../controllers/listController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = Router();

router.get('/', authMiddleware, fetchLists);
router.get('/listInfo/:list_id', fetchListInfo);

router.post('/addList', fetchAddList);
router.post('/deleteList', fetchDeleteList);

module.exports = router;