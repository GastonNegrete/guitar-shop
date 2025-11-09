document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    const main = document.querySelector('main');

    const newDivForm = document.createElement('div');

    const newTitleForm = document.createElement('h1');
    newTitleForm.innerText = 'Contactanos';

    const newForm = document.createElement('form');

    function crearSeccionForm(){

        const newDivForm = document.createElement('div');
        const newTitleForm = document.createElement('h1');
        newTitleForm.innerText = 'Contactanos';

        const newForm = document.createElement('form');

        const newPName = document.createElement('p');

        

        return newDivForm;
    }


})