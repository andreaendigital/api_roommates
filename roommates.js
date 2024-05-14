const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

//--------------------------------------------------------------------------------------
async function agregarRoommate() {
  const { data } = await axios.get("http://randomuser.me/api");
  //console.log("data: ", data); //imprime por consola la data obtenida
  //console.log("data result : ", data.results);
  // console.log("data result 0 : ", data.results[0]);
  const randomUser = data.results[0];
  
  //crear una variable usuario con los valores
  const usuario = {
    id: uuidv4().slice(30),
    nombre: randomUser.name.first,
    email: randomUser.email,
    debe: 0,
    recibe: 0,
    total: 0,
  };
  // console.log("usuario : ", usuario);

   //ingresar el usuario al arreglo roommates
  const { roommates } = JSON.parse(
    fs.readFileSync("./data/roommates.json", "utf8")
  );
  roommates.push(usuario);
  //sobreescribe el archivo roommates.json con la nueva data o nuevo usuario
  fs.writeFileSync("./data/roommates.json", JSON.stringify({ roommates }));

  return roommates;
}

//--------------------------------------------------------------------------------------
async function consultarRoommates() {
  const roommatesData = JSON.parse(
    await fs.readFileSync("./data/roommates.json", "utf8")
  );
  return roommatesData;
}

module.exports = { consultarRoommates, agregarRoommate };

// module.exports = {insertar, consultar, eliminar, editar}; //exporto la función
