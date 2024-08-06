import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import {lastValueFrom} from "rxjs";

@Injectable()
export class AppService {
    constructor(@Inject('TODO_SERVICE') private readonly client: ClientProxy) {}

    async sendMessage(pattern: string, data: any) {
        return lastValueFrom(this.client.send(pattern, data));
    }
}