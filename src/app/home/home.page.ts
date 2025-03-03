import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IonHeader,IonText, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { SocketIOClientService } from '../socketio-client.service';
import { DataModel } from 'src/DataModel';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class HomePage {

  weekChart: Chart | undefined;
  latestTemperature = 0;
  latestHumidity = 0;
  latestReadings: DataModel[] = [];

  constructor(private socketIo: SocketIOClientService, private http: HttpClient) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.http.get<DataModel[]>('http://localhost:5000/data/graph/week').subscribe((data) => {
      data.sort((a, b) => {
        return new Date(a.timestamp).getDay() - new Date(b.timestamp).getDay();
      });
      this.weekChart = new Chart('weekChart', {
        type: 'bar',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [
            {
              label: 'Average temperature',
              data: data.map((d) => d.temperature),
              borderWidth: 1,
            },
            {
              label: 'Average humidity',
              data: data.map((d) => d.humidity),
              borderWidth: 1,
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
   

    this.socketIo.DataUpadate().subscribe((data) => {
      console.log(data);
      this.latestTemperature = data.temperature;
      this.latestHumidity = data.humidity;
      this.latestReadings.push(data);
      if (this.latestReadings.length > 10) {
        this.latestReadings.shift();
      }
    });
  }
}
