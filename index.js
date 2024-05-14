// npm init --yes
// npm i express
// npm i morgan
// npm i axios
// npm i uuid
// npm i nodemon

const axios = require("axios"); //importación de axios
const express = require("express"); //importación de express
const fs = require("fs"); //importando fyle system
const { v4: uuidv4 } = require("uuid");

const app = express(); //instanciando express
const PORT = 3000;

app.use(express.json()); //Middleware

app.listen(PORT, () => {
  console.log("El server ya está listo. Habilitado en puerto ", PORT);
});

//Ruta GET para mostrar el index
app.get("/", (req, res) => {
  console.log("Mostrando el index.html en ruta raíz, método get");
  res.sendFile(__dirname + "/index.html");
});

// app.post;

app.get("/", async (req, res) => {
  const { data } = await axios.get("http://randomuser.me/api");
  console.log(data); //imprime por consola la data obtenida
  res.send();
});

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

  res.json({roommates});
});

//Ruta para enlistar los roomates agregados
app.get("/roommates", async (req, res) => {
    try {
    //   const registros = await consultar();
    // se lee el archivo json, se convierte en objeto parseandolo, se asigna el objeto a la variable listaRoommates y se devulve al front
    const roommatesData = JSON.parse(await fs.readFileSync("./data/roommates.json", "utf8"));
    // const listaRoommates = roommatesData.roommates;

    console.log("Respuesta de roommatesData: ", roommatesData);
      console.log("Respuesta de roommatesData.roommates: ", roommatesData.roommates);
      // res.json(registros);
      // res.status(200).send(registros);
      console.log("aqui estoy")
    //   res.status().json({ listaRoommates });
    res.json(roommatesData);
    } catch (error) {
      // console.log("Error: ", error);
      console.log("Error del get roommates: ", error.message);
      res.status(500).send(error);
    }
  });

//Ruta para ingresar gastos, obteniendo datos del payload (body)
app.post("/gasto", async (req, res) => {
   //lee las propiedades del payload que recibe realizando destructuring
    const { roommate, descripcion, monto} = req.body;
    // console.log('Roommate:', roommate);
    // console.log('Descripción:', descripcion);
    // console.log('Monto:', monto);
    //crear una variable usuario con los valores obtenidos del destructuring
       const gasto = {
        id: uuidv4().slice(30),
        roommate,
        descripcion,
        monto,
        fecha: new Date() 
        // new Date(timestamp);
    };
    console.log("gasto: ", gasto); //imprime por consola la data obtenida

    //ingresar el gasto al arreglo gastos
    const { gastos } = JSON.parse(
      fs.readFileSync("./data/gastos.json", "utf8")
    );
  
    gastos.push(gasto);
    console.log("gastos, arreglo: ", gastos); //imprime por consola la data obtenida

    //sobreescribe el archivo gastos.json con el nuevo gasto
    fs.writeFileSync("./data/gastos.json", JSON.stringify({ gastos }));
  
    res.json({gastos});
  });

  //Ruta para enlistar los gastos agregados
app.get("/gastos", async (req, res) => {
    try {
    //   const registros = await consultar();
    // se lee el archivo json, se convierte en objeto parseandolo, se asigna el objeto a la variable listaRoommates y se devulve al front
    const gastosData = JSON.parse(await fs.readFileSync("./data/gastos.json", "utf8"));
    // const listaRoommates = roommatesData.roommates;

    console.log("Respuesta de gastosData: ", gastosData);
      console.log("Respuesta de gastosData.gastos: ", gastosData.gastos);
      // res.json(registros);
      // res.status(200).send(registros);
      console.log("aqui estoy en get gastos")
    //   res.status().json({ listaRoommates });
    res.json(gastosData);
    } catch (error) {
      // console.log("Error: ", error);
      console.log("Error del get roommates: ", error.message);
      res.status(500).send(error);
    }
  });