const listModel = require('../models/listModel.js');

exports.fetchLists = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID no proporcionat' });
    }

    const lists = await listModel.getLists(user_id);

    if (!lists || lists.length === 0) {
      return res.status(200).json({ lists: [] });
    }

    res.json({ lists });
  } catch (error) {
    console.error("Error en obtenir les llistes", error);
    res.status(500).json({ message: "Error obtenint les llistes" });
  }
};

exports.fetchSharedLists = async (req, res) => {
  const { user_id } = req.params;

  try {
    if (!user_id) {
      return res.status(400).json({ message: 'User ID no proporcionat' });
    }

    const sharedLists = await listModel.getSharedLists(user_id);

    if (!sharedLists || sharedLists.length === 0) {
      return res.status(200).json({ sharedLists: [] });
    }

    res.json({ sharedLists });

  } catch (error) {
    console.error("Error en obtenir les llistes compartides", error);
    res.status(500).json({ message: "Error obtenint les llistes compartides" });
  }
}

exports.fetchAddList = async (req, res) => {
  try {
    const { name, user_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    await listModel.addList(name, user_id);
    res.json({ message: 'Llista afegida correctament' });

  } catch (error) {
    console.error("Error en afegir la llista", error);
    res.status(500).json({ message: 'Error creating the list' });
  }
};

exports.fetchDeleteList = async (req, res) => {
  try {
    const { list_id } = req.body;

    if (!list_id) {
      return res.status(400).json({ message: 'List ID is required' });
    }

    await listModel.deleteList(list_id);
    res.json({ message: 'Llista eliminada correctament' });

  } catch (error) {
    console.error("Error en eliminar la llista", error);
    res.status(500).json({ message: 'Error deleting the list' });
  }
};

exports.fetchListInfo = async (req, res) => {
  try {
    const { list_id } = req.params;

    if (!list_id) {
      return res.status(400).json({ message: 'List ID is required' });
    }

    const listInfo = await listModel.getListInfo(list_id);

    if (listInfo.length === 0) {
      return res.status(202).json({ message: 'No information found for this list', listInfo: [] });
    }

    res.json({
      listInfo,
      movie_count: listInfo[0].movie_count
    });

  } catch (error) {
    console.error("Error getting list info", error);
    res.status(500).json({ message: 'Error getting list information' });
  }
};

exports.fetchAddFilmToList = async (req, res) => {
  try {
    const { list_id, movie_id } = req.body;

    if (!list_id || !movie_id) {
      return res.status(400).json({ message: 'List ID and Movie ID are required' });
    }

    await listModel.addFilmToList(list_id, movie_id);
    res.json({ message: 'Film added to list successfully' });

  } catch (error) {
    console.error("Error adding film to list", error);
    res.status(500).json({ message: 'Error adding film to list' });
  }
};

exports.fetchDeleteFilmFromList = async (req, res) => {
  try {
    const { list_id, movie_id } = req.body;

    if (!list_id || !movie_id) {
      return res.status(400).json({ message: 'List ID and Movie ID are required' });
    }

    await listModel.deleteFilmFromList(list_id, movie_id);
    res.json({ message: 'Film deleted from list successfully' });

  } catch (error) {
    console.error("Error deleting film from list", error);
    res.status(500).json({ message: 'Error deleting film from list' });
  }
};

exports.shareList = async (req, res) => {
  const { list_id } = req.params;
  const { user_id, friend_id } = req.body;

  console.log("Sharing list", list_id, user_id, friend_id);

  try {
    const shareList = await listModel.shareList(list_id, user_id, friend_id);

    if (!shareList) {
      return res.status(400).json({ message: 'Error sharing the list' });
    }

    res.json({ message: 'List shared successfully' });
  } catch (error) {
    console.error("Error sharing list", error);
    res.status(500).json({ message: 'Error sharing the list' });
  }
};

exports.checkMovieInList = async (req, res) => {
  try {
    const { listId, movieId } = req.params;

    const exists = await listModel.checkMovieInList(listId, movieId);

    res.json({ exists });
  } catch (error) {
    console.error('Error checking movie in list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
