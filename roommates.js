const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

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

//--------------------------------------------------------------------------------------
async function editarRoommates(data) {
  // Extraer las propiedades del objeto 'data'
  const { roommate, descripcion, monto } = data; 
  
  // leer cuantos roommates son en el archivo json
  const roommatesData = JSON.parse(fs.readFileSync("./data/roommates.json", "utf8"));
  // console.log("edicion roommates, rommatesData: ", roommatesData);
  const roommatesLista = roommatesData.roommates;
  const cantidadRoommates = roommatesLista.length
  // calcular: el monto ingresado dividido por la cantidad de roommates
  let montoRepartir = monto/cantidadRoommates;

  // console.log("edicion roommates, roommate: ", roommate);
  // console.log("edicion roommates, monto: ", monto);
  // console.log("edicion roommates, cantidad de roommates ", roommatesLista.length);
  // console.log("edicion roommates, monto a repartir: ", montoRepartir);

  // creo un nuevo arreglo en donde debo: 
  // asignar a los nombres no coincidentes el montoRepartir en variable "debe"
  // asignar a el nombre que sí coincide el montoRepartir en variable "recibe"
  
  let roommatesActualizados = roommatesLista.map((r) => {
    // Verificar si el nombre del roommate no es igual al nombreRoommate dado
    if (r.nombre !== roommate) {
      // Si no es igual, se actualiza el parámetro 'debe'
      return { ...r, debe: r.debe + montoRepartir };
    } else {
      // Si es igual, se devuelve el roommate sin modificar
      return { ...r, recibe: r.recibe + montoRepartir };
    }
  });

  // luego escribir el archivo json con la nueva información
  fs.writeFileSync("./data/roommates.json", JSON.stringify({ roommates: roommatesActualizados }));
  console.log("Roommates actualizados correctamente.");
  return roommatesActualizados;
}

module.exports = { consultarRoommates, agregarRoommate, editarRoommates };

// module.exports = {insertar, consultar, eliminar, editar}; //exporto la función
