import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';  
import { DataModel } from 'src/DataModel';

@Injectable({
  providedIn: 'root'
})
export class SocketIOClientService {

  private socket: Socket = io('http://localhost:5000');

  constructor() { }

  public DataUpadate(): Observable<DataModel> {
    return new Observable<DataModel>(observer => {
      this.socket.on('new_data', (data: DataModel) => {
        observer.next(data);
      });
    });
  }

}
