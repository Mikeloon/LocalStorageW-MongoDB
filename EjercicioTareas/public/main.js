window.onload = function (){


    let txtfield = document.getElementById("tarea");
    let lista = document.getElementById("lista");
    let borrado = document.getElementById("borrar");
    let subir = document.getElementById("subida");
    let bajar = document.getElementById("descarga");
    let listatareas = JSON.parse(localStorage.getItem("tareas") || "[]");
    //let url = "http://localhost:63342/IntelliJ/Nodejs/public/index.html?_ijt=a7i7dkqv23vp2rfgsieakb6njk&_ij_reload=RELOAD_ON_SAVE"

    if (listatareas.length != 0){
        for (let i = 0; i< listatareas.length; i++){
            lista.innerHTML += "<li type = disc>" +listatareas[i].text+
                "</li>";
        }
    }

    txtfield.addEventListener('keydown', e =>{
        if (e.keyCode == 13){
            let tarea = txtfield.value;
            lista.innerHTML += "<li type = disc> " +tarea+
                "</li>";
            const json = {text : tarea};
            listatareas.push(json);
            localStorage.setItem("tareas", JSON.stringify(listatareas));
            txtfield.value = "";
        }
    });

    borrado.addEventListener('click', e =>{
        listatareas = JSON.parse(localStorage.getItem("tareas"));
        if (listatareas.length != 0){
            localStorage.clear();
            while (listatareas.length != 0){
                listatareas.pop();
                lista.removeChild(lista.firstChild);
            }

        }
    });

    subir.addEventListener('click', e =>{
        if (listatareas.length == 0) console.log("No hay tareas para subir!")
        if (listatareas.length != 0){fetch('/', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(listatareas)
        })
            .then(r => r.text()) // use r.json() if you expect to get a json response
            .then(r => console.log(r))}
    });

    bajar.addEventListener('click', async (e) =>{
        let json = await fetchJSON('/api/download');
        let tareas = [];
        json.forEach(e =>{
            let j = {text : e.text};
            tareas.push(j);
        })
        if (json.length != 0){
            for (let i = 0; i< json.length; i++){
                lista.innerHTML += "<li type = disc>" +json[i].text+
                    "</li>";
            }
            localStorage.setItem("tareas", JSON.stringify(tareas));
        }
    });

    async function fetchJSON(file) {
        let jsonObj = [];
        await fetch(file).then(r => r.json()).then(r =>{
            jsonObj = r
        });
        return jsonObj;
    }
}
