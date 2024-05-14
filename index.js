// npm init --yes
// npm i express
// npm i morgan
// npm i axios
// npm i uuid
// npm i nodemon

const axios = require("axios"); //importación de axios
const express = require("express"); //importación de express
const fs = require("fs"); //importando fyle system
const { v4: uuidv4 } = require("uuid"); //importando uuid

const app = express(); //instanciando express
const PORT = 3000;

app.use(express.json()); //Middleware

app.listen(PORT, () => {
  //levantando servidor
  console.log("El server ya está listo. Habilitado en puerto ", PORT);
});

//Importando funcion desde el módulo consultas.js:
const {
  consultarRoommates,
  //   insertar,
} = require("./roommates.js");

const { ingresarGastos, listarGastos, eliminarGasto, editarGasto } = require("./gastos.js");

//--------------------------------------------------------------------------------------
//Ruta GET para mostrar el index
app.get("/", (req, res) => {
  console.log("Mostrando el index.html en ruta raíz, método get");
  res.sendFile(__dirname + "/index.html");
});

// app.post;
//--------------------------------------------------------------------------------------
// app.get("/", async (req, res) => {
//   const { data } = await axios.get("http://randomuser.me/api");
//   console.log(data); //imprime por consola la data obtenida
//   res.send();
// });

//--------------------------------------------------------------------------------------
//Ruta para agregar usuario, en la cual se obtienen los datos desde el api randomUser
app.post("/roommate", async (req, res) => {
  const { data } = await axios.get("http://randomuser.me/api");
  //console.log("data: ", data); //imprime por consola la data obtenida
  //console.log("data result : ", data.results);
  console.log("data result 0 : ", data.results[0]);

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
  console.log("usuario : ", usuario);

  //ingresar el usuario al arreglo roommates
  const { roommates } = JSON.parse(
    fs.readFileSync("./data/roommates.json", "utf8")
  );

  roommates.push(usuario);

  //sobreescribe el archivo roommates.json con la nueva data o nuevo usuario
  fs.writeFileSync("./data/roommates.json", JSON.stringify({ roommates }));

  res.json({ roommates });
});

//--------------------------------------------------------------------------------------
//Ruta para enlistar los roomates agregados
app.get("/roommates", async (req, res) => {
  try {
    const roommatesData = await consultarRoommates();
    // console.log("Respuesta de roommatesData: ", roommatesData);
    // console.log( "Respuesta de roommatesData.roommates: ", roommatesData.roommates);
    res.status(200).json(roommatesData);
  } catch (error) {
    // console.log("Error: ", error);
    console.log("Error Ruta Get Roommates: ", error.message);
    res.status(500).send("Error interno del servidor: ", error.message);
  }
});

//--------------------------------------------------------------------------------------
//Ruta para ingresar gastos, obteniendo datos del payload (body)
app.post("/gasto", async (req, res) => {
  try {
    //lee las propiedades del payload que recibe realizando destructuring
    const { roommate, descripcion, monto } = req.body;

    // Llama a la función ingresarGastos para agregar el nuevo gasto
    const gastosActualizados = await ingresarGastos(
      roommate,
      descripcion,
      monto
    );

    // Envía una respuesta JSON con los gastos actualizados
    res.json({ gastos: gastosActualizados });
  } catch (error) {
    console.error("Error al ingresar gasto:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al ingresar el gasto" });
  }
});

//--------------------------------------------------------------------------------------
//Ruta para enlistar los gastos agregados
app.get("/gastos", async (req, res) => {
  try {
    // Llama a la función listarGastos para obtener la lista de gastos
    const listaGastos = await listarGastos();
    res.json(listaGastos);
  } catch (error) {
    console.error("Error al listar gastos:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los gastos" });
  }
});

//--------------------------------------------------------------------------------------
//Ruta para eliminar un gasto por id por query string
app.delete("/gasto", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("id de gasto a eliminar: ", id);

    // Llama a la función eliminarGasto para eliminar el gasto con el ID especificado, deposita el resultado en la variable
    const gastosFiltrados = await eliminarGasto(id);
    res.json(gastosFiltrados);

  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    res.status(500).json({ error: "Error interno del servidor al eliminar el gasto" });
  }
});

//--------------------------------------------------------------------------------------
//Ruta para editar gastos por payload
app.put("/gasto", async (req, res) => {
  try {
  //lee las propiedades del payload y del query string, realizando destructuring
  const { id } = req.query;
  const { roommate, descripcion, monto } = req.body;
  //crea la variable gasto
  // const gasto = { id, roommate, descripcion, monto };
  // console.log("ruta gasto put para editar, objeto que llega: ", gasto);

  // Llama a la función editarGasto para editar el gasto con el ID especificado
  const data = { roommate, descripcion, monto };
  const gastosEditados = await editarGasto(id, data);

  res.json(gastosEditados);
  } catch (error) {
    console.error("Error al editar el gasto:", error);
    res.status(500).json({ error: "Error interno del servidor al editar el gasto" });
  }
});
