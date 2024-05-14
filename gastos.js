const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

async function ingresarGastos(roommate, descripcion, monto) {
  // console.log('Roommate:', roommate);
  // console.log('Descripción:', descripcion);
  // console.log('Monto:', monto);
  //crear una variable usuario con los valores obtenidos del destructuring
  const gasto = {
    id: uuidv4().slice(30),
    roommate,
    descripcion,
    monto,
    fecha: new Date(),
  };
  //console.log("gasto: ", gasto); //imprime por consola la data obtenida
  //ingresar el gasto al arreglo gastos:
  const { gastos } = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));
  gastos.push(gasto);
  console.log("gastos, arreglo: ", gastos); //imprime por consola la data obtenida

  //sobreescribe el archivo gastos.json con el nuevo gasto:
  fs.writeFileSync("./data/gastos.json", JSON.stringify({ gastos }));

  return gastos;
}

module.exports = { ingresarGastos };//exporto la función

