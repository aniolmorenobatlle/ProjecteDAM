const { Router } = require('express');
const { fetchLists, fetchAddList, fetchDeleteList, fetchListInfo, fetchAddFilmToList, fetchDeleteFilmFromList, shareList } = require('../controllers/listController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = Router();

router.get('/', authMiddleware, fetchLists);
router.get('/listInfo/:list_id', fetchListInfo);

router.post('/addList', fetchAddList);
router.post('/deleteList', fetchDeleteList);
router.post('/addFilmToList', fetchAddFilmToList);
router.post('/deleteFilmFromList', fetchDeleteFilmFromList);
router.post('/share-list/:list_id', authMiddleware, shareList)

module.exports = router;