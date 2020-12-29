import axios from "axios";
function getdata(obj){
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        } 
    }
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    if(!userId){
        userId = 0;
    };
    if(!token){
        token = '';
    }
    obj.formdata.append('userId',userId);
    obj.formdata.append('token',token);
    return new Promise((resolve,reject) =>{
        axios.post(obj.url,obj.formdata,config).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}
export default getdata;