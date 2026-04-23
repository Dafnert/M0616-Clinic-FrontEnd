export class Patient{
    id:number=0;
    name:string="";
    surname:string="";
    age:number=0;
    username:string="";
    password:string="";
    constructor(id =0,name="",surname="", age =0, username="", password="" ){
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.age=age;
        this.username=username;
        this.password=password;
    }
}
 