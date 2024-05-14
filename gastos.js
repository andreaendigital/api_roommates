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


async function listarGastos() {
        // se lee el archivo json, se convierte en objeto parseandolo, se asigna el objeto a la variable listaRoommates y se devulve al front

        const gastosData = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));
        // console.log("Respuesta de gastosData: ", gastosData);
        // console.log("Respuesta de gastosData.gastos: ", gastosData.gastos);
    return gastosData;
}


async function eliminarGasto(id) {
    //lee la lista de gastos, filtra la lista de gastos para eliminar el gasto con el ID especificado y luego la vuelve a escribir para persistencia de información
    const gastosJSON = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));
    // console.log("En eliminar, la lista de gastos es: ", gastosJSON);
    const gastosFiltrados = gastosJSON.gastos.filter((g) => g.id !== id);
    fs.writeFileSync("./data/gastos.json", JSON.stringify({ gastos: gastosFiltrados }));
    
    // console.log(
    //     "En eliminar, cuantos gastos son antes ",
    //     gastosJSON.gastos.length
    //   );
    //   console.log("En eliminar, la nueva lista es: ", gastosFiltrados);
    //   console.log(
    //     "En eliminar, cuantos gastos son ahora ",
    //     gastosFiltrados.length
    //   );
    
    return gastosFiltrados;
    
}

module.exports = { ingresarGastos, listarGastos, eliminarGasto };//exporto la función

