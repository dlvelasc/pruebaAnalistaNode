const express = require('express');
const totp=require("totp-generator");
const util = require('util');
const router = express.Router();
const mysqlConnection = require('../database');

const queryConn = util.promisify(mysqlConnection.query).bind(mysqlConnection);

router.get('/', (req,res) => {
    mysqlConnection.query('SELECT * FROM tokens',(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    }); 
});

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
            const TokenP = totp(seed,{ timestamp: (now()/1000)-10} );
            var token;
            if tokenNum == tokenA {
                token = tokenS;
            }elif(tokenNum == tokenP){
                token = tokenP;
            }
            mysqlConnection.query('SELECT used FROM tokens WHERE id = ?',(err,rows,fields) => {
                if(!err){
                    res.json(rows);
                }else{
                    console.log(err);
                }
            }); 
            
        }
    })()
    
});

router.post('/generarToken',(req,res)=>{
    let query = `CALL tokenAdd(?,?,?,?)`;
    const  userId = req.body['id'];
    
    (async () => {
        try {
            const rows = await queryConn('SELECT privateKey FROM users WHERE id = ?',[userId]);
            console.log(rows);
            const seed=JSON.parse(JSON.stringify(rows))[0]['privateKey'];
            console.log(seed);
            const token=totp(seed, { period: 60 });
            
            mysqlConnection.query(query,[0,token,userId,0],(err,rows,fields)=>{
                if(!err){
                    res.json(token);
                }
            
                else{
                    res.json(err);
                } 
            });
        } finally {
        }
    })()
});

   /*  mysqlConnection.query('SELECT privateKey FROM users WHERE id = ?',[userId],(err,rows,field)=>{
        if(!err){
            const seed=rows[0];
            const token=totp(seed, { period: 60 });
            mysqlConnection.query(query,[0,token,userId,0,date_ob.toISOString().slice(0, 19).replace('T', ' ')],(err,rows,fields)=>{
                if(!err){
                    res.json(token);
                }
            
                else{
                    res.json(err);
                } 
            });
        }else{
            res.json(err);
        }
    }); */
});

module.exports= router;