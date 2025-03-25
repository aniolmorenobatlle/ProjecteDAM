const listModel = require('../models/listModel.js');

exports.fetchLists = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const lists = await listModel.getLists(user_id);
    res.json({ lists });

  } catch (error) {
    console.error("Error en obtenir les llistes", error);
    res.status(500).json({ message: 'Error getting the lists' });
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
}