const listModel = require('../models/listModel.js');

exports.fetchLists = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID no proporcionat' });
    }

    const lists = await listModel.getLists(user_id);

    if (!lists || lists.length === 0) {
      return res.status(404).json({ message: 'No hi ha llistes disponibles' });
    }

    res.json({ lists });
  } catch (error) {
    console.error("Error en obtenir les llistes", error);
    res.status(500).json({ message: "Error obtenint les llistes" });
  }
};

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
      return res.status(404).json({ message: 'No information found for this list' });
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