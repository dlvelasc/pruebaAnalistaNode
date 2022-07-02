const express = require('express');
const totp=require("totp-generator");
const util = require('util');
const router = express.Router();
const mysqlConnection = require('../database');

const queryConn = util.promisify(mysqlConnection.query).bind(mysqlConnection);

/* router.get('/', (req,res) => {
    mysqlConnection.query('SELECT * FROM tokens',(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    }); 
}); */

router.get('/:id',(req,res) => {
    const { id } = req.params;
    console.log(id);
    mysqlConnection.query('SELECT * FROM users WHERE id = ?',[id],(err,rows,fields) => {
        if(!err){
            res.json(rows[0]);
        }else{
            console.log(err);
        }
    });
});


router.post('/usarToken',(req,res)=>{
   
   let date_ob=new Date();

    let query = `CALL tokenAdd(?,?,?,?)`;
    const  tokenNum = req.body['token'];
    const  userId = req.body['id'];
    (async () => {
        try {
            const rows = await queryConn('SELECT privateKey FROM users WHERE id = ?',[userId]);
            console.log(rows);
            const seed=JSON.parse(JSON.stringify(rows))[0]['privateKey'];
            console.log(seed);
            const tokenA=totp(seed, { period: 60 });
            const tokenP = totp(seed,{ timestamp: (Date.now()/1000)-10} );
            var token;
            if (tokenNum == tokenA) {
                token = tokenA;
            }else if (tokenNum == tokenP){
                token = tokenP;
            }
            mysqlConnection.query('UPDATE tokens SET used = true WHERE value = ?',[token],(err,rows,fields) => {
                if(!err){
                    res.json("Procedimiento exitoso");
                }else{
                    console.log(err);
                    res.json("Intente de nuevo, TOKEN invalido");
                }
            }); 
        }finally {    
        }
    })()
    
});

router.get('/generarToken/:id',(req,res)=>{
    let query = 'CALL tokenAdd(?,?,?,?)';
    const { id } = req.params;
    //const userId = req.params['id'];
    console.log( req.params)
    console.log(id);
    (async () => {
        try {
            const rows = await queryConn('SELECT privateKey FROM users WHERE id = ?',[id]);
            console.log(rows);
            const seed=JSON.parse(JSON.stringify(rows))[0]['privateKey'];
            console.log(seed);
            const token=totp(seed, { period: 60 });
            
            mysqlConnection.query(query,[0,token,id,0],(err,rows,fields)=>{
                if(!err){
                    res.json({'token':token});
                }
            
                else{
                    res.json(err);
                } 
            });
        } finally {
        }
    })()
});

module.exports= router;