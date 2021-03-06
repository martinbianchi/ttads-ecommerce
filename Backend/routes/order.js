var mongoose = require('mongoose');
var router=require('express').Router();
var Order = mongoose.model('Order');
var OrderDetail = mongoose.model('OrderDetail');
var ProdProv = mongoose.model('ProdProv');
var auth = require('../middlewares/authenticate'); //import middleware to protect some routes

var async = require('async');
var ObjectId = mongoose.Types.ObjectId;

//Get all
router.get('/', auth, (req, res, next) => {
    Order.find({}).populate('idCustomer').populate('order')
    .populate({ 
        path: 'order',
        populate: {
          path: 'prodprov',
          model: 'ProdProv'
        } 
    }).then(order => {
        if(!order) {return res.sendStatus(401);}
        return res.json(order)
    })
    .catch(next);
})

//Get one
router.get('/:id', (req, res, next) => {
    Order.findById(req.params.id).populate('idCustomer').populate('order')
    .then(order => {
        if(!order){
            res.send("Not found");
        }
        else{
            res.json(order);
        }
    });   
});

//Update ship
router.put('/update/:id', auth, (req, res, next) => {
    console.log("entra back");
    Order.findById(req.params.id).then((order) => {
        order.shipped = req.body.shipped;
        order.save((err, doc) => {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(200).send(doc)
            }
        });
    });
});

//Create
router.post('/new', (req, res, err) => {
    let total = req.body.total;
    let idCustomer = req.body.idCustomer._id;
    let order = req.body.order;

    let ordersId =[];

  order.forEach( (item, index, array) => {
                let nitems = array.length - 1;   
                var newOrderDetail = new OrderDetail({
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    prodprov: item.idProdProv
                });
                
                newOrderDetail.save((err, doc) => {
                })
                .then((doc) => {  
                    ordersId.push(doc._id);
                    if(ordersId.length === array.length){
                        
                        var neworder = new Order({   
                            total: total,
                            shipped: false,
                            idCustomer: idCustomer,
                            order: ordersId
                        });
                        neworder.save(function(err, doc){
                            if(err){
                               res.send('Error al intentar guardar el pedido.');
                            }
                            else{
                                res.json({ message: 'Pedido agregado', data: doc });
                            }
                        });
                    }
                });

            });

});

module.exports=router;