class WebSocketService {
    constructor(wsHash) {
        return;
        this.wsAttempts = 0;
        this.cb = (data)=>console.log('Do something with data');
        this.ws = new WebSocket('ws://' + window.location.hostname+':'+ window.location.port+'/ws?token='+wsHash);
        console.log('Initiate WebSocket @','ws://' + window.location.hostname+':'+ window.location.port+'/ws?token='+wsHash);
        this.ws.onmessage = (msg)=>{this._processMessage(msg)};
        this.ws.onopen = ()=>{
            var msg = JSON.stringify({action:'connected'})
            this.ws.send(msg);
        }
    }

    _processMessage(msg){
        this.cb(JSON.parse(msg.data));
    }

    _deferSend(ws, callback){
        setTimeout(()=>{
                if (this.ws.readyState === 1) {
                    console.log("Connection is made")
                    if(callback != null){
                        callback();
                    }
                    return;

                } else {
                    console.log("wait for connection...");
                    this.wsAttempts++;
                    this._deferSend(this.ws, callback);
                }

        }, 5); // wait 5 milisecond for the connection...
    }

    subscribe(id,fn){
        return;
        this._deferSend(this.ws,()=>{
            console.log('Subscribing to ',id);
            this.cb = fn;
            this.ws.send(JSON.stringify({action:'subscribe',data:id}));
        })          
    }



    unsubscribe(id){
        return;
        if (this.ws) {
            console.log('Unsubscribing to ',id);
            this.ws.send(JSON.stringify({action:'unsubscribe',data:id}));
        }
    }
}

let webSocketService = new WebSocketService(InstaAdminConfig.wsHash);

export default webSocketService;
