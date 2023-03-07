// document.addEventListener("DOMContentLoaded", ()=> {
//     alert('dsaf');
// });


const formToObject = (formSelector) =>{
    let formData = new FormData(formSelector);

    let resObj = {};
    for (const i of formData.keys()) {
        resObj[i] = formData.get(i);
    }

    return resObj;
}


const addNumberToList = (number)=>{
    let list = document.querySelector('.number-list');
    list.innerHTML += `
        <div class="number-item">${number}</div>
    `;
}

function isEmpty(str) {
    if (str.trim() == '') 
      return true;
      
    return false;
  }


const start = ()=>{
    let btn = document.querySelector('#generateRandomNumberForm').querySelector('.submit');

    btn.addEventListener('click', (e)=>{
        e.preventDefault();

        let form = document.querySelector('#generateRandomNumberForm');
        let formData = new FormData(form);

        let queryParams = '';
        for( let i of formData.keys()){
            queryParams += `${i}=${formData.get(i)}&`;
            if(isEmpty(formData.get(i))) return
        }

        $.ajax({
            url: `/random?${queryParams}`,
            method: 'get',
            dataType: 'json',

            success: function(data){   
                let inputElement = document.querySelector('#sendNumber');
                inputElement.value = data.random
            }
        });
            
    })

    
    let addNumberBtn = document.querySelector('#addNumberForm').querySelector('.submit');

    addNumberBtn.addEventListener('click', (e)=>{
        e.preventDefault();

        let addNumberForm = document.querySelector('#addNumberForm')
        
        let formValues = formToObject(addNumberForm);
        
        
        $.ajax({
            url: '/addNumber',
            method: 'post',
            dataType: 'json',
            data: formValues,

            complete: function(data, s){
                if(data.status == 200){
                    addNumberToList(formValues.number);
                }
                
            }
        });
        
    })
    



    
    
}


document.addEventListener("DOMContentLoaded", start);