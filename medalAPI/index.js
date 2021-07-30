var BASE_CONTACT_API_PATH = "/api/v1";

var contacts = [
    {
        "name": "pablo",
        "phone": 12345
    },
    {
        "name": "pepe",
        "phone": 6789
    }
];

 module.exports.register = (app) => {

    app.get(BASE_CONTACT_API_PATH+"/contacts", (req,res)=>{
        res.send(JSON.stringify(contacts,null,2));
     });
    
    app.post(BASE_CONTACT_API_PATH+"/contacts", (req,res)=>{
        var newContact = req.body;
        
        console.log(`new contact to be added: <${JSON.stringify(newContact,null,2)}>`);
    
        contacts.push(newContact);
    
        res.sendStatus(201);
     });

     app.delete(BASE_CONTACT_API_PATH+"/contacts/:contactName", (req,res)=>{
        var contactName = req.params.contactName;

        console.log(`contact to be deleted: <${contactName}>`);

        contacts = contacts.filter( (c)=>{
            return (c.name != contactName);
        });
    
        res.sendStatus(200);
     });



 };