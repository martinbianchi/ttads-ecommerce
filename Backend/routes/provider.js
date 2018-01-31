var mongoose = require('mongoose');
var router=require('express').Router();
var Provider = mongoose.model('Provider');
var ProdProvSchema = mongoose.model('ProdProv');
var ProductSchema = mongoose.model('Product');


var ObjectId = mongoose.Types.ObjectId;


//Get all
router.get('/', (req, res, next) => {
    Provider.find({}).populate('products').then(provider => {
        if(!provider) {return res.sendStatus(401);}
        return res.json(provider)
    })
    .catch(next);
})

//Get one
router.get('/:id', (req, res, next) => {
    Provider.findById(req.params.id).populate('products')
    .then(provider => {
        if(!provider){
            res.send("Not found");
        }
        else{
            res.json(provider);
        }
    });   
});

//Create
router.post('/new', (req, res, err) => {
    let cuit = req.body.cuit;
    let company = req.body.company;
    let adress = req.body.adress;
    let phone = req.body.phone;
    let products = req.body.products;

    var provider = new Provider({   
        cuit: cuit,
        company: company,
        adress: adress,
        phone: phone,
        products: products
    });

    provider.save(function(err, doc){
        if(err){
           res.send('Error al intentar guardar el proveedor.');
        }
        else{
            res.json({ message: 'Proveedor agregado', data: doc });
        }
     });
    
});

router.delete('/delete/:id', (req, res, next) =>{
    let id = req.params.id;
    let idProdProvs = [];

    Provider.findById(id, (err, provider) => {
        
        if(err){
            res.status(500).send(err);
        }
        else{
            idProdProvs = provider.prodprovs;
            provider.remove();
            let response = {
                message: "Proveedor eliminado correctamente",
                data: provider
            };
            res.status(200).send(response);
        }
    })
    .then(() => {
        deleteProdProvs(idProdProvs)
                        .then((idProds) => {
                            var index = 0;
                            async.eachSeries(idProds, function(id, next) {
                                console.log("index "+index);
                                ProductSchema.findById(id, (err, prod) => {
                                    indexPP = prod.prodprovs.indexOf(idProdProvs[index]);
                                    prod.prodprovs.splice(indexPP, 1);
                                    prod.save((err, doc) => {
                                        index++;
                                        next();
                                    });
                                })
                            })
                        })
    });
});

function deleteProdProvs(arrayProdProv){
    return new Promise( function (resolve, reject){
        let idProds = [];
        arrayProdProv.forEach((idPP, index, array) => {
            ProdProvSchema.findById(idPP, (err, prodprov) => {
                idProds.push(prodprov.idProduct);
                prodprov.remove();
                console.log(idProds);
                if(idProds.length === (array.length)){
                    resolve(idProds);
                }
            });

            
        });
    })
}

router.put('/update/:id', (req, res, next) =>{
    let query = {"_id": req.params.id};
    Provider.findOneAndUpdate(query, {$set: req.body},{new: true},function(err, provider){
        if(err){
            res.send("got an error");
        }
        else{
            res.send(provider);                
        }
    });
})

module.exports=router;