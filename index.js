const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.listen(PORT, console.log("Servidor encendido en http://localhost:3000"));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// leer 
const dataFile = path.join(__dirname, "canciones.json");

const leerCanciones = () => fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf-8")) : [];
//json
const guardarCanciones = (canciones) => fs.writeFileSync(dataFile, JSON.stringify(canciones, null, 2), "utf-8");

// leer todas las canciones
app.get("/canciones", (req, res) => {
    res.json(leerCanciones());
});

// agregar
app.post("/canciones", (req, res) => {
    const canciones = leerCanciones();
    const nuevaCancion = req.body;
    canciones.push(nuevaCancion);
    guardarCanciones(canciones);
    res.send("Canción agregada");
});

// editar por id
app.put("/canciones/:id", (req, res) => {
    let canciones = leerCanciones();
    const { id } = req.params;
    const index = canciones.findIndex((c) => c.id == id);

    if (index !== -1) {
        canciones[index] = req.body;
        guardarCanciones(canciones);
        res.send("Canción modificada con éxito");
    } else {
        res.status(404).send("Canción no encontrada");
    }
});

// eliminar
app.delete("/canciones/:id", (req, res) => {
    let canciones = leerCanciones();
    const { id } = req.params;
    canciones = canciones.filter((c) => c.id != id);
    guardarCanciones(canciones);
    res.send("Canción eliminada ");
});
