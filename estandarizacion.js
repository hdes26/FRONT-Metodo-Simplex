
let variables;
let restricciones;
let opcion;


//-----------------------------------------------------------------------------------------------------------//
function enviar(){
    variables=convertir_numero(document.getElementById('variables').value);
    restricciones=convertir_numero(document.getElementById('restricciones').value);
    opcion=document.getElementById('select_multiples').value;
    if (variables && restricciones && opcion) {
        create_fun_obj();
        create_restricciones();
    }
    
    
}

//funcion objetivo
let OSI=0;//identificacion de +-0Si
let MA=0;//identificacion de +-MAI

//estadarizacion de las restricciones
let SI=0;//identificacion de +-Si
let AI=0;//identificacion de +-Ai

//Listas
let lista=[];//lista donde se guardara todoa las restricciones sin estandarizar
let list_ob=[];//lista que contiene la funcion objetivo
let lista_rectric_estan=[];// esta lista contendra la nueva lista de estandarizacion de las restricciones

leer_fun_obj();//lee la funcion objetivo
leer_restricciones();// leé las retricciones
console.log("restricciones")
console.log(lista);


console.log("Opcion:"+opcion);
switch(opcion){
    case 1://maximizar
        document.querySelector('resultado').textContent=Estandarizacion_general(lista,list_ob,"max");
        console.log(Estandarizacion_general(lista,list_ob,"max"));
        console.log("restricciones estandarizadas");
        console.log(lista_rectric_estan);
        break;
    case 2://minimizar
        console.log(Estandarizacion_general(lista,list_ob,"min"));
        console.log("restricciones estandarizadas");
        console.log(lista_rectric_estan);
        break;
}



//funcion leer  las restricciones y meterlas en un array
function leer_restricciones(){
    for (let i = 0; i <= restricciones-1; i++) {
        //creamos un array que ira´ dentro del array lista
        console.log("Restriccion:"+(i+1));
        let lista_temp=[];//array

        for (let j = 0; j <=variables+1; j++) {
            let varx=prompt("Restriccion"+(i+1)+"\n"+'x'+(j+1)+":");
            if(j!=variables){
                lista_temp.push(convertir_numero(varx));
            }else{
                lista_temp.push(varx)
            }
            
        }
        lista.push(lista_temp);
    }

}

// crea los cuadros de donde se obtendra los datos de la funcion objetivo//
function create_fun_obj(){
    const label=document.querySelector(".titulo_fun")
    label.removeAttribute('style')
    const labell=document.querySelector(".restriccion_titulo")
    labell.removeAttribute('style')

    const funcion_obj=document.querySelector('.f_objt');
  
    for (let index = 0; index <=variables-1; index++) {
        funcion_obj.innerHTML+= `
        <input type="text" name="" class=""  style="width:9.5%; height: 10%; border-radius: 6px; border:none;">
        <label for="">x<sub>${index+1}</sub></label>
        ${mas(index, variables)}
        `        
    }

}



function create_restricciones(){
    let vi=variables+2;
    console.log(vi)
    const restricciones_input=document.querySelector('.restriccion_div');
    for (let i = 0; i <= restricciones-1; i++) {
        restricciones_input.innerHTML+=`<div class="input" style="display:flex; font-weight: bold;"> </div>`
        const int=document.querySelectorAll('.input');
        for (let j = 0; j <=(variables+1); j++) {
            //console.log(vi)
            int[i].innerHTML+= `  <input type="text" name="" class=""  style="width:4.5%; height: 10%; border-radius: 6px; border:none;">
            <label for="" style="margin-left:4px;"> x<sub>${j+1} </sub> </label>
            <label for="" style="color:rgb(0, 255, 0); margin-right:4px;"> ${mass(j, variables)}</label>
            `     
        }
    }

    
}

function crea_inputs(){
   
         
} 

//funcion que leera los datos de entrada de la funcion objetivo y los guardara en el array List
function leer_fun_obj(){
    let array_obj=[];//array
    for (let i = 0; i <=variables-1; i++) {
        let funcion_obj=parseInt(prompt("Funcion objetivo \n"+"x"+(i+1)));
        array_obj.push(funcion_obj);
    }
    list_ob.push(array_obj);
    // console.log("funcion objetivo:"+array_obj);
}

// se realiza el proceso de estandarizacion
function Estandarizacion_general(lista_res,lista_funobj,max_min){
    
    let Lista_obj=lista_funobj;
    let Lista_t=lista_res;
    let vari="";

    if(max_min=="max"){
        vari="-MA"
    }else if(max_min=="min"){
        vari="+MA";
    }

    //estandarizacion de la funcion objetivo
    for (let i = 0; i <restricciones; i++){
        if(Lista_t[i][variables]==">="){
           OSI++
           MA++
            Lista_obj[0].push("+0S"+OSI+vari+MA)
        } else if(Lista_t[i][variables]=="<="){
            OSI++
             Lista_obj[0].push("+0S"+OSI)
        }else if(Lista_t[i][variables]=="="){
            MA++
             Lista_obj[0].push(vari+MA)
        }
    }

    //estadarizacion de las restricciones
    
    for (let i = 0; i <=Lista_t.length-1; i++) {
       if(Lista_t[i][variables]==">="){
           SI++
           AI++
            Lista_t[i].splice(variables,1,("-S"+SI+"+A"+AI),"=");
       }else if(Lista_t[i][variables]=="<="){
            SI++
            Lista_t[i].splice(variables,1,("+S"+SI),"=");
       }else if(Lista_t[i][variables]=="="){
            AI++
            Lista_t[i].splice(variables,1,("+A"+AI),"=");
       }
   
    }
    lista_rectric_estan=Lista_t;
    return Lista_obj;
}


//fuction convertir numero de string a int
function convertir_numero(numero){
    let Numero=parseInt(numero);
    return Numero;
}

//validar el signo + despues de cada input
function mas(index, variable){
    if(index==(variable-1)){
        return " "
    }else{
      return " + "
    }
}

function mass(index, variable){
    if(index==(variable+1)){
        return " "
    }else{
      return " + "
    }
}