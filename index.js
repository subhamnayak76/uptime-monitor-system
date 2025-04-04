const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const axios = require('axios');
const cron = require('node-cron');
const {publishEmailEvents}= require('./pubsub')
const app = express()

app.use(express.json())

app.get('/health',(req,res) =>{
    res.json({msg : "hello world"})
})
app.post('/monitor',async(req,res) =>{
    const {url , email , interval} = req.body
    console.log(url)
    try {
    const monitor = await prisma.monitor.create({
        data : {
            Url : url,
            email,
            interval
        }
    })
    return res.json({"data": monitor})
}catch(e) {
 console.log("errors",e)    
}

})

async function check_url (){
    const urls = await prisma.monitor.findMany()
    console.log(urls)
    for (const urlentry of urls){
        const { id,Url,email,status } = urlentry
        console.log(Url)

        try {
        
            const response = await axios.get(Url)
            await prisma.monitor.update({
                where : {id},
                data : {
                    status : 'UP',
                }
            })
            console.log(`${Url} is up`)
        } catch (error) {
            console.log(`${Url} is down: ${error.message}`)

            await prisma.monitor.update({
                where : {id},
                data : {
                    status : 'DOWN',
                }
            })


            publishEmailEvents({
                Url,
                email,
                status: 'DOWN',
            
            })
        }
       
    }
}

cron.schedule('* * * * *', () => {
    console.log("cron-job started")
    check_url()
  });

const PORT = 3000 
app.listen(PORT,()=>{
    console.log("serving for the port",PORT)
})


