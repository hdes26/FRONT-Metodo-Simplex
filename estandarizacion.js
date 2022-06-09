
let variables;
let restricciones;
let opcion;
let calcular;
let body;
let restriccionezone;
let fun;


$('.form').hide();
$('.down').hide();

setTimeout(() => {
    $('.word').hide();
    $('.overlay').hide();

    $('.form').show();


}, 1000);

//-----------------------------------------------------------------------------------------------------------//
function enviar() {

    $('#calcular').hide();
    $('.titulo_fun').hide();
    $('.restriccion_titulo').hide();

    $('.word').show();
    $('.overlay').show();


    if ($('.restriccion_div').find('p').length > 1) {
        $(".f_objt").find('span').remove();
        $(".f_objt").find('input').remove();
        $(".f_objt").find('label').remove();
        $(".column").remove();
    }



    setTimeout(() => {
        variables = parseInt(document.getElementById('variables').value);
        restricciones = parseInt(document.getElementById('restricciones').value);
        opcion = document.getElementById('select_multiples').value;
        if (variables && restricciones && opcion) {
            calcular = document.getElementById('calcular');
            fun = document.querySelector('.titulo_fun');
            fun.setAttribute('style', 'display:block;');
            calcular.setAttribute('style', 'display:block;');

            create_fun_obj();
            create_restricciones();
        }
    }, 1000);

    setTimeout(() => {
        $('.word').hide();
        $('.overlay').hide();

    }, 1000);

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
            if (data[j].value == "1") {
                lista_temp.push(data[j].value + "X" + (j + 1))
                continue;
            }
            if (data[j].value == "3" && j == 1) {
                lista_temp.push(data[j].value + "X" + (j + 1))
                continue;
            }
            lista_temp.push(data[j].value)
        }
        lista.push(lista_temp);
    }
}



// crea los cuadros de donde se obtendra los datos de la funcion objetivo//
function create_fun_obj() {
    const label = document.querySelector(".titulo_fun")
    label.removeAttribute('style')
    const labell = document.querySelector(".restriccion_titulo")
    labell.removeAttribute('style')

    const funcion_obj = document.querySelector('.f_objt');

    for (let index = 0; index <= variables - 1; index++) {
        funcion_obj.innerHTML += `
        <input type="text" name="" class="obj"  style="width:5%;">
        <label for="">x<sub>${index + 1}</sub></label>
        ${mas(index, variables - 1)}
        `
    }

}



function create_restricciones() {
    const restricciones_input = document.querySelector('.restriccion_div');
    for (let i = 0; i <= restricciones - 1; i++) {
        restricciones_input.innerHTML += `<p class="column" style="display:flex;"> </p>`
        const int = document.querySelectorAll('.column');
        for (let j = 0; j <= (variables - 1); j++) {
            int[i].innerHTML += `  <input type="text" name="" class="row"  style="width:5%;">
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

    $('.funcion_obj').hide();
    $('.restriccion_div').hide();
    $('.resultados').hide();
    $('#calcular').hide();

    $('.word').show();
    $('.overlay').show();

    setTimeout(() => {
        $('.down').show();


        leer_fun_obj()
        leer_restricciones()
        let resultado = document.querySelector('.resultados');
        let opcion = parseInt(document.getElementById('select_multiples').value);
        let titulo_festandarizada = document.querySelector('.titulo_festandarizada');
        titulo_festandarizada.setAttribute('style', 'display:block;')
        switch (opcion) {
            case 1://maximizar
                /* FUNCION ESTANDARIZADA */
                list_ob = Estandarizacion_general(lista, list_ob, "max");
                resultado.innerHTML += `
                                        <tr>
                                         <th>${list_ob}</th>
                                        </tr>`;

                console.log(list_ob);
                console.log("restricciones estandarizadas");
                console.log(lista_rectric_estan);
                break;
            case 2://minimizar
                list_ob = Estandarizacion_general(lista, list_ob, "min");
                console.log("funcion estandarizada")
                console.log(list_ob);
                console.log("restricciones estandarizadas");
                console.log(lista_rectric_estan);
                break;
        }
    }, 2000);


    setTimeout(() => {
        $('.funcion_obj').show();
        $('.restriccion_div').show();
        $('.resultados').show();

        $('.word').hide();
        $('.overlay').hide();


        jQuery("html, body").animate({ scrollTop: jQuery(window).height() }, 2000);



    }, 2000);
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
        vari = "MA";
    }

    //estandarizacion de la funcion objetivo
    for (let i = 0; i < restricciones; i++) {
        if (Lista_t[i][variables] == ">=") {

            Lista_obj.push("0S" + OSI)
            Lista_obj.push(vari + MA)
            console.log(Lista_obj)
        } else if (Lista_t[i][variables] == "<=") {
            OSI++
            Lista_obj.push("0S" + OSI)
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
            Lista_t[i].splice(variables, 1, (("-" + 1 + "S") + SI), ((1 + "A") + AI), "=");
        } else if (Lista_t[i][variables] == "<=") {
            SI++
            Lista_t[i].splice(variables, 1, ((1 + "S") + SI), "=");
        } else if (Lista_t[i][variables] == "=") {
            AI++
            Lista_t[i].splice(variables, 1, ((1 + "A") + AI), "=");
        }

    }

    lista_rectric_estan = Lista_t;
    tables();
    return Lista_obj;
}

//validar el signo + despues de cada input
function mas(index, variable) {
    if (index == (variable)) {
        return ""
    } else {
        return `<span>+</span>`;

    }
}







function tables() {

    let nuevalista = lista;

    nuevalista[0].splice(3, 0, '0');
    nuevalista[0].splice(4, 0, '0');


    nuevalista[1].splice(2, 0, '0');
    nuevalista[1].splice(4, 0, '0');
    nuevalista[1].splice(5, 0, '0');


    nuevalista[2].splice(2, 0, '0');
    nuevalista[2].splice(3, 0, '0');
    nuevalista[2].splice(5, 0, '0');
    nuevalista[2].splice(6, 0, '0');




    console.log(nuevalista);

    let funcobjetivo = {
        "SA": [["1X1", "1X2", "-1S1", "0", "0", "1A1", "0", "=", "2"], ["1X1", "1X2", "0", "-1S2", "0", "0", "1A2", "=", "3"], ["1X1", "3X2", "0", "0", "1S3", "0", "0", "=", "12"]],
        "funcObj": ["1X1", "2X2", "0S1", "0S2", "0S3", "MA1", "MA2"]
    }



    fetch('https://backend-simplex.herokuapp.com/api/resolve', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcobjetivo)
    })
        .then(response => response.json())
        .then(data => console.log(data));
}





/* LOADING */

function Ticker(elem) {
    elem.lettering();
    this.done = false;
    this.cycleCount = 5;
    this.cycleCurrent = 0;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
    this.charsCount = this.chars.length;
    this.letters = elem.find('span');
    this.letterCount = this.letters.length;
    this.letterCurrent = 0;

    this.letters.each(function () {
        var $this = $(this);
        $this.attr('data-orig', $this.text());
        $this.text('-');
    });
}

Ticker.prototype.getChar = function () {
    return this.chars[Math.floor(Math.random() * this.charsCount)];
};

Ticker.prototype.reset = function () {
    this.done = false;
    this.cycleCurrent = 0;
    this.letterCurrent = 0;
    this.letters.each(function () {
        var $this = $(this);
        $this.text($this.attr('data-orig'));
        $this.removeClass('done');
    });
    this.loop();
};

Ticker.prototype.loop = function () {
    var self = this;

    this.letters.each(function (index, elem) {
        var $elem = $(elem);
        if (index >= self.letterCurrent) {
            if ($elem.text() !== ' ') {
                $elem.text(self.getChar());
                $elem.css('opacity', Math.random());
            }
        }
    });

    if (this.cycleCurrent < this.cycleCount) {
        this.cycleCurrent++;
    } else if (this.letterCurrent < this.letterCount) {
        var currLetter = this.letters.eq(this.letterCurrent);
        this.cycleCurrent = 0;
        currLetter.text(currLetter.attr('data-orig')).css('opacity', 1).addClass('done');
        this.letterCurrent++;
    } else {
        this.done = true;
    }

    if (!this.done) {
        requestAnimationFrame(function () {
            self.loop();
        });
    } else {
        setTimeout(function () {
            self.reset();
        }, 750);
    }
};

$words = $('.word');

$words.each(function () {
    var $this = $(this),
        ticker = new Ticker($this).reset();
    $this.data('ticker', ticker);
});

/* LOADING END */