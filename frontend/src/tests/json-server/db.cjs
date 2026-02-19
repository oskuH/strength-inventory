const initialData = require('./db.json');

module.exports = () => {
  const data = { ...initialData };

  data.users = data.users.map(user => ({
    ...user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  data.gyms = data.gyms.map(gym => ({
    ...gym,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  data.equipment = data.equipment.map(piece => ({
    ...piece,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  return data;
};