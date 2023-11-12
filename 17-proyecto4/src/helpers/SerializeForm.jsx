export const SerializeForm = (form) => {
    const formData = new FormData(form);

    const completeObj = {};

    //Desestructurandolo en un array los datos del objeto formData
    for (let [name, value] of formData){
        //console.log([name, value]);
        completeObj[name] = value;
    }

    return completeObj;

}