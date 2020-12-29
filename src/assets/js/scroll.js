// 禁止页面滑动
function stop(){
    var mo= function(e){
        e.preventDefault();
    };
    document.addEventListener("touchmove",mo,false);
}
// 取消滑动限制*
function move(){
    var mo=function(e){
        e.preventDefault();
    };
    document.removeEventListener("touchmove",mo,false);
}
// 时间转换成年月日形式
function changeTime(date){
    let time = new Date(date);
    let year = time.getFullYear(),month = double(time.getMonth()+1),day = double(time.getDate()),hour = double(time.getHours()),minute = double(time.getMinutes()),second = double(time.getSeconds());
    return year+'年'+month+'月'+day+"日";
}

// 时间转换成年月日时分形式
function changeDate(date){
    let time = new Date(date);
    let year = time.getFullYear(),month = double(time.getMonth()+1),day = double(time.getDate()),hour = double(time.getHours()),minute = double(time.getMinutes()),second = double(time.getSeconds());
    return year+'-'+month+'-'+day+'  '+hour+':'+minute;
}

// 时间转换成年月日形式
function changeDateWay(date){
    let time = new Date(date);
    let year = time.getFullYear(),month = double(time.getMonth()+1),day = double(time.getDate()),hour = double(time.getHours()),minute = double(time.getMinutes()),second = double(time.getSeconds());
    return year+'-'+month+'-'+day;
}
function double(str){
    if(Number(str)>9){
        return str;
    }else{
        return "0"+str;
    }
}
//判断是否为手机号码
function isPoneAvailable(poneInput) {
    var myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(poneInput)) {
        return false;
    } else {
        return true;
    }
}
//验证是否为合法身份证号码
function isCardNo(card)
{
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(reg.test(card) === false)
    {
        return  false;
    }
    return true
}
/**
 * 判断是否为数字
 * @param number
 * @returns {boolean}
 */
function isNumber (number) {
    console.log(isNaN(number))
    return typeof value === 'number' && !isNaN(number);
}
/**
 * 判断是否不为数字
 * @param number
 * @returns {boolean}
 */
function isNotNumber (number){
    return !this.isNumber(number)
}
// 清空数据信息
function clear(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
}

export default {
    stop,
    move,
    changeTime,
    changeDate,
    clear,
    isPoneAvailable,
    isCardNo,
    isNotNumber,
    isNumber,
    changeDateWay
};