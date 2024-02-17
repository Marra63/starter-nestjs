import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from '../app.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private appService: AppService) { }

    @WebSocketServer() server: Server;

    @SubscribeMessage('stateChange')
    async handleStateChange(client: Socket, data: any): Promise<void> {
        //await this.appService.createMessage(payload);
        console.log("stateChange")
        this.server.emit('stateWasChanged', data);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, data: any): Promise<void> {
        //await this.appService.createMessage(payload);
        console.log("sendMessage")
        this.server.emit('message was sended');
    }

    afterInit(server: Server) {
        //console.log(server);
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        //Выполняем действия
    }

    handleDisconnect(client: Socket) {
        console.log(`Disconnected: ${client.id}`);
        //Выполняем действия
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`);
        //Выполняем действия
    }
}