
let variables;
let restricciones;
let opcion;
let calcular;
let body;
let restriccionezone;
let fun;



//-----------------------------------------------------------------------------------------------------------//
function enviar() {


    variables = parseInt(document.getElementById('variables').value);
    restricciones = parseInt(document.getElementById('restricciones').value);
    opcion = document.getElementById('select_multiples').value;
    if (variables && restricciones && opcion) {
        calcular = document.getElementById('calcular');
        fun = document.querySelector('.titulo_fun');
        fun.setAttribute('style', 'display:block;');
        calcular.setAttribute('style', 'display:block;');

        create_fun_obj("x");
        create_restricciones();
    }

}




//funcion objetivo
let OSI = 0;//identificacion de +-0Si
let MA = 0;//identificacion de +-MAI

//estadarizacion de las restricciones
let SI = 0;//identificacion de +-Si
let AI = 0;//identificacion de +-Ai

//Listas
let lista = [];//lista donde se guardara todoa las restricciones sin estandarizar
let list_ob = [];//lista que contiene la funcion objetivo
let lista_rectric_estan = [];// esta lista contendra la nueva lista de estandarizacion de las restricciones

//funcion leer  las restricciones y meterlas en un array
function leer_restricciones() {
    const column = document.querySelectorAll('.column')
    for (let i = 0; i <= restricciones - 1; i++) {
        //creamos un array que ira´ dentro del array lista
        const data = column[i].querySelectorAll('.row')
        let lista_temp = [];//array
        for (let j = 0; j <= variables + 1; j++) {
            lista_temp.push(data[j].value)
        }
        lista.push(lista_temp);
    }

}



// crea los cuadros de donde se obtendra los datos de la funcion objetivo//
function create_fun_obj(mostrar) {

    const label = document.querySelector(".titulo_fun")//titulo
    label.removeAttribute('style')
    const labell = document.querySelector(".restriccion_titulo")
    labell.removeAttribute('style')
    const funcion_obj = document.querySelector('.f_objt');


    // mostrar funcion objetivo en pantalla sin estandarizar
    const p_mostrar_funobj=document.querySelector('.muestra_funobjt')
    p_mostrar_funobj.setAttribute('style', 'display: flex')
    if(mostrar=="y"){
        for (let index = 0; index <= variables - 1; index++) {
            p_mostrar_funobj.innerHTML += `
            <p class="f">
            ${list_ob[index]}<label for="">x<sub>${index + 1}</sub></label>${mas(index, variables - 1)}
            </p>
            `
        }
    }else if(mostrar=="x"){
        for (let index = 0; index <= variables - 1; index++) {
            funcion_obj.innerHTML += `
            <input type="text" name="" class="obj"  style="width:5%; height: 10%;">
            <label for="">x<sub>${index + 1}</sub></label>
            ${mas(index, variables - 1)}
            `
        }
    }
    

}



function create_restricciones() {
    const restricciones_input = document.querySelector('.restriccion_div');
    for (let i = 0; i <= restricciones - 1; i++) {
        restricciones_input.innerHTML += `<p class="column" style="display:flex;"> </p>`
        const int = document.querySelectorAll('.column');
        for (let j = 0; j <= (variables - 1); j++) {
            int[i].innerHTML += `  <input type="text" name="" class="row"  style="width:5%; height: 10%;">
             <label for="">x<sub>${j + 1}</sub></label>
             ${mas(j, variables - 1)} <label for="" style="width: 1%;"></label>
            `

        }

        for (let index = variables; index <= variables + 1; index++) {

            if (index == (variables + 1)) {
                int[i].innerHTML += `  <input type="text" name="" class="row"  style="width:5%; height: 10%;">`
            } else {
                int[i].innerHTML += `  
                <select name="select" id="select_multiples_m" required class="row">
                    <option value=">=">>=</option>
                    <option value="<="><=</option>
                    <option value="=">=</option>
                </select>
                <label for="" style="width: 1%;"></label>
                    `
            }

        }

    }
}

function ejecutar() {
    calcular.setAttribute('style', 'display:none;');
    

    leer_fun_obj()
    leer_restricciones() 
    let opcion = parseInt(document.getElementById('select_multiples').value);
    let titulo_festandarizada = document.querySelector('.titulo_festandarizada');
    titulo_festandarizada.setAttribute('style','display:block;')
    let muestra_funcionobjt=document.querySelector('.muestra_funobjt');
    muestra_funcionobjt.setAttribute('style','display:block;');
    let muestra_res_estan=document.querySelector('.muestra_estand')
    muestra_res_estan.setAttribute('style','display:block;')
    switch (opcion) {
        case 1://maximizar
        create_fun_obj('y')
        /* FUNCION ESTANDARIZADA */
            // list_ob = Estandarizacion_general(lista, list_ob, "max");
            // muestra_funcionobjt.innerHTML += `
            //                         <tr>
            //                          <th>${list_ob}</th>
            //                         </tr>`;
        /*  RESTRICCIONES ESTANDARIZADAS*/
            // muestra_res_estan.innerHTML+=`
            // <tr>
            //  <th>${lista_rectric_estan}</th>
            // </tr>`
            // console.log(list_ob);
            // console.log("restricciones estandarizadas");
            // console.log(lista_rectric_estan);
            break;
        case 2://minimizar
            list_ob = Estandarizacion_general(lista, list_ob, "min");
            console.log("funcion estandarizada")
            console.log(list_ob);
            console.log("restricciones estandarizadas");
            console.log(lista_rectric_estan);
            break;
    }
}

//funcion que leera los datos de entrada de la funcion objetivo y los guardara en el array List
function leer_fun_obj() {
    const fun_obj = document.querySelectorAll('.obj')
    for (let i = 0; i <= variables - 1; i++) {
        list_ob.push(fun_obj[i].value);
    }

}

// se realiza el proceso de estandarizacion
function Estandarizacion_general(lista_res, lista_funobj, max_min) {

    let Lista_obj = lista_funobj;

    let Lista_t = lista_res;

    let vari = "";

    if (max_min == "max") {
        vari = "-MA"
    } else if (max_min == "min") {
        vari = "+MA";
    }

    //estandarizacion de la funcion objetivo
    for (let i = 0; i < restricciones; i++) {
        if (Lista_t[i][variables] == ">=") {
            OSI++
            MA++
            Lista_obj.push("+0S" + OSI + vari + MA)
        } else if (Lista_t[i][variables] == "<=") {
            OSI++
            Lista_obj.push("+0S" + OSI)
        } else if (Lista_t[i][variables] == "=") {
            MA++
            Lista_obj.push(vari + MA)
        }
    }

    //estadarizacion de las restricciones

    for (let i = 0; i <= Lista_t.length - 1; i++) {
        if (Lista_t[i][variables] == ">=") {
            SI++
            AI++
            Lista_t[i].splice(variables, 1, ("-S" + SI + "+A" + AI), "=");
        } else if (Lista_t[i][variables] == "<=") {
            SI++
            Lista_t[i].splice(variables, 1, ("+S" + SI), "=");
        } else if (Lista_t[i][variables] == "=") {
            AI++
            Lista_t[i].splice(variables, 1, ("+A" + AI), "=");
        }

    }
    lista_rectric_estan = Lista_t;
    return Lista_obj;
}

//validar el signo + despues de cada input
function mas(index, variable) {
    if (index == (variable)) {
        return ""
    } else {
        return "+"
    }
}

