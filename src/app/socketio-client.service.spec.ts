import { TestBed } from '@angular/core/testing';

import { SocketIOClientService } from './socketio-client.service';

describe('WebSocketClientService', () => {
  let service: SocketIOClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketIOClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
