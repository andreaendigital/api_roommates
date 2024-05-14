const fs = require("fs");
// se lee el archivo json, se convierte en objeto parseandolo, se asigna el objeto a la variable listaRoommates y se devulve al front

async function consultarRoommates() {
  const roommatesData = JSON.parse(
    await fs.readFileSync("./data/roommates.json", "utf8")
  );
  return roommatesData;
}

module.exports = { consultarRoommates };

// module.exports = {insertar, consultar, eliminar, editar}; //exporto la función
