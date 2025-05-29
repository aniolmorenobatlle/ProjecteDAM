const { Router } = require('express');
const { fetchLists, fetchSharedLists, fetchAddList, fetchDeleteList, fetchListInfo, fetchAddFilmToList, fetchDeleteFilmFromList, shareList, checkMovieInList, deleteSharedListToUser } = require('../controllers/listController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = Router();

router.get('/', authMiddleware, fetchLists);
router.get('/shared/:user_id', authMiddleware, fetchSharedLists);
router.get('/listInfo/:list_id', fetchListInfo);

router.post('/addList', fetchAddList);
router.post('/deleteList', fetchDeleteList);
router.post('/addFilmToList', fetchAddFilmToList);
router.post('/deleteFilmFromList', fetchDeleteFilmFromList);
router.post('/share-list/:list_id', authMiddleware, shareList);

router.delete('/:listId/shared/:friendId', authMiddleware, deleteSharedListToUser);

router.get('/:listId/movies/:movieId/check', authMiddleware, checkMovieInList);

module.exports = router;