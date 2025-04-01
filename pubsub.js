const Redis = require('ioredis')
const redisPublisher = new Redis() 
const redisSubscriber = new Redis() 

const CHANNEL = 'email_alerts'

function publishEmailEvents(data) {
    redisPublisher.publish(CHANNEL,JSON.stringify(data))
    console.log('Published alert:',data)
}


function subscribeToEmailEvents(handler){
    redisSubscriber.subscribe(CHANNEL,()=>{
        console.log('subscribed to email alerts')
    })

    redisSubscriber.on('message',(channel,message) =>{
        if(channel === CHANNEL){
            const data = JSON.parse(message)
            handler(data)
        }
    })
}


module.exports = {
    publishEmailEvents,
    subscribeToEmailEvents
}