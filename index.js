// npm init --yes
// npm i express
// npm i morgan
// npm i axios
// npm i uuid
// npm i nodemon

const express = require("express"); //importación de express
const fs = require("fs"); //importando fyle system
// const axios = require("axios"); //importación de axios
// const { v4: uuidv4 } = require("uuid"); //importando uuid

const app = express(); //instanciando express
const PORT = 3000;

app.use(express.json()); //Middleware

app.listen(PORT, () => {
  //levantando servidor
  console.log("El server ya está listo. Habilitado en puerto ", PORT);
});

//Importando funciones:
const { consultarRoommates, agregarRoommate, editarRoommates } = require("./roommates.js");
const {
  ingresarGastos,
  listarGastos,
  eliminarGasto,
  editarGasto,
} = require("./gastos.js");

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
  try {
    const roommates = await agregarRoommate();
    console.log("Nuevo roommate agregado:", roommates[roommates.length - 1]);
    res.status(201).json({ roommates });
  } catch (error) {
    console.error("Error al agregar un roommate:", error.message);
    res
      .status(500)
      .send(
        "Error interno del servidor al agregar un roommate: ",
        error.message
      );
  }
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

    // Validar que los campos obligatorios estén presentes
    if (!roommate || !descripcion || !monto) {
      console.log(
        "Se requieren todos los campos: roommate, descripcion y monto."
      );
      return res
        .status(400)
        .json({
          error:
            "Se requieren todos los campos: roommate, descripcion y monto.",
        });
    }

    if (
      roommate == undefined ||
      descripcion == undefined ||
      monto == undefined
    ) {
      console.log(
        "Se requieren todos los campos: roommate, descripcion y monto."
      );
      return res
        .status(400)
        .json({
          error:
            "Se requieren todos los campos: roommate, descripcion y monto.",
        });
    }

    // Llama a la función ingresarGastos para agregar el nuevo gasto
    const gastosActualizados = await ingresarGastos(
      roommate,
      descripcion,
      monto
    );

    // Envía una respuesta JSON con los gastos actualizados
    res.status(201).json({ gastos: gastosActualizados });
  } catch (error) {
    console.error("Error al ingresar gasto:", error.message);
    res
      .status(500)
      .json("Error interno del servidor al ingresar el gasto:", error.message);
  }
});

//--------------------------------------------------------------------------------------
//Ruta para enlistar los gastos agregados
app.get("/gastos", async (req, res) => {
  try {
    // Llama a la función listarGastos para obtener la lista de gastos
    const listaGastos = await listarGastos();
    res.status(200).json(listaGastos);
  } catch (error) {
    console.error("Error al listar gastos:", error.message);
    res
      .status(500)
      .json("Error interno del servidor al listar los gastos: ", error.message);
  }
});

//--------------------------------------------------------------------------------------
//Ruta para eliminar un gasto por id por query string
app.delete("/gasto", async (req, res) => {
  try {
    const { id } = req.query;
  
    // Llama a la función eliminarGasto para eliminar el gasto con el ID especificado, deposita el resultado en la variable
    const gastosFiltrados = await eliminarGasto(id);
    console.log("Gasto eliminado Exitosamente");
    res.status(200).json(gastosFiltrados);
  } catch (error) {
    console.error("Error al eliminar el gasto:", error.message);
    res
      .status(500)
      .json("Error interno del servidor al eliminar el gasto: ", error.message);
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

    // Validar que los campos obligatorios estén presentes
    if (!roommate || !descripcion || !monto) {
      console.log(
        "Se requieren todos los campos para editar: roommate, descripcion y monto."
      );
      return res
        .status(400)
        .json({
          error:
            "Se requieren todos los campos para editar: roommate, descripcion y monto.",
        });
    }

    if (
      roommate == undefined ||
      descripcion == undefined ||
      monto == undefined
    ) {
      console.log(
        "Se requieren todos los campos para editar: roommate, descripcion y monto."
      );
      return res
        .status(400)
        .json({
          error:
            "Se requieren todos los campos para editar: roommate, descripcion y monto.",
        });
    }

    // Llama a la función editarGasto para editar el gasto con el ID especificado
    const data = { roommate, descripcion, monto };
    const gastosEditados = await editarGasto(id, data);

    res.status(201).json(gastosEditados);
  } catch (error) {
    console.error("Error al editar el gasto: ", error.message);
    res
      .status(500)
      .json("Error interno del servidor al editar el gasto: ", error.message);
  }
});


//--------------------------------------------------------------------------------------
//Ruta para editar roommate 
app.put("/roommates", async (req, res) => {
  try {
    //lee las propiedades del payload y del query string, realizando destructuring
    // const { id } = req.query; //no requiero id por que se editan todos los roommates 
    const { roommate, descripcion, monto } = req.body;
    
    //crea la variable gasto
    // const gasto = { id, roommate, descripcion, monto };
    // console.log("ruta gasto put para editar, objeto que llega: ", gasto);

    // No se validarán campos por que en esta ocasión siempre son entregados

    // Llama a la función editarGasto para editar el gasto con el ID especificado
    const data = { roommate, descripcion, monto };
    const roommatesEditados = await editarRoommates(data);

    res.status(201).json(roommatesEditados);
  } catch (error) {
    console.error("Error al editar los rommates: ", error.message);
    res.status(500).json({ error: 'Error interno del servidor al editar los roommates' });
  }
});
