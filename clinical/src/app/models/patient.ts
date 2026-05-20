export class Patient{
    id:number=0;
    name:string="";
    surname:string="";
    age:number=0;
    dni:string="";
    username:string="";
    password:string="";
    disease:string="";
    observations:string="";
    alergias:string|null=null;
    isVih:boolean=false;
    acceptedPrivacy: boolean;
    acceptedAnesthesia: boolean;
    constructor(id =0,name="",surname="", age =0, username="", password="", disease="", observations="" , dni="", alergias:string|null=null, acceptedPrivacy=false, acceptedAnesthesia=false){
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.age=age;
        this.username=username;
        this.password=password;
        this.disease=disease;
        this.observations=observations;
        this.dni=dni;
        this.alergias=alergias;
        this.acceptedPrivacy = acceptedPrivacy;
        this.acceptedAnesthesia = acceptedAnesthesia;
    }
}
 