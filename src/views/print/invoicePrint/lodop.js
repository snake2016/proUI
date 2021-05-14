import printDemo from "./companys/invoiceDemo.js"
const companysList = {
    // "reissue": reissue
}
//  直接打印 
export function onPrint(data){
    let comFUn =printDemo;
    comFUn(data)
}