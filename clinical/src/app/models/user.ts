export class user{
    id:number=0;
    name:string="";
    surname:string="";
    age:number=0;
    speciality:string="";
    username:string="";
    password:string="";
    img: string=""
    constructor(id =0,name="",surname="", age =0, speciality="", username="", password="" ){
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.age=age;
        this.speciality=speciality;
        this.username=username;
        this.password=password;
        this.img=this.img;
    }
}
 