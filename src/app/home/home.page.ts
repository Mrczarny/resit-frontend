import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { IonButton, IonInput, IonHeader,IonText, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { SocketIOClientService } from '../socketio-client.service';
import { DataModel } from 'src/DataModel';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonButton, IonInput, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class HomePage {

  weekChart: Chart | undefined;
  customChart: Chart | undefined;
  latestTemperature = 0;
  latestHumidity = 0;
  latestReadings: DataModel[] = [];
  startTimestamp = "2025-02-23T13:38:41Z";
  endTimestamp = "2025-02-23T13:48:41Z";
  points = 10;


  constructor(private socketIo: SocketIOClientService, private http: HttpClient) {}

  onChartUpdate(): void {
    this.customChart?.destroy();
    this.http.get<DataModel[]>('https://resit-backed-0k0q.onrender.com/data/graph', {params: {
      point_count: this.points,
      start_time: this.startTimestamp,
      end_time: this.endTimestamp,
    }}).subscribe((data: DataModel[]) => {
      this.customChart = new Chart('customChart', {
        type: 'line',
        data: {
          labels: data.map((d) => d.timestamp),
          datasets: [
            {
              label: 'Temperature',
              data: data.map((d) => d.temperature),
              borderColor: 'rgb(255, 99, 132)'
            },
            {
              label: 'Humidity',
              data: data.map((d) => d.humidity),
              borderColor: 'rgb(54, 162, 235)'
            }
          ],},
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                maxRotation: 90,
              }
            }
          }
        }
      });
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.http.get<DataModel[]>('https://resit-backed-0k0q.onrender.com/data/graph/week').subscribe((data) => {
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
    this.http.get<DataModel[]>('https://resit-backed-0k0q.onrender.com/data/graph', {params: {
      point_count: this.points,
      start_time: this.startTimestamp,
      end_time: this.endTimestamp,
    }}).subscribe((data: DataModel[]) => {
      this.customChart = new Chart('customChart', {
        type: 'line',
        data: {
          labels: data.map((d) => d.timestamp),
          datasets: [
            {
              label: 'Temperature',
              data: data.map((d) => d.temperature),
              borderColor: 'rgb(255, 99, 132)'
            },
            {
              label: 'Humidity',
              data: data.map((d) => d.humidity),
              borderColor: 'rgb(54, 162, 235)'
            }
          ],},
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                maxRotation: 90,
              }
            }
          }
        }
      });
    })
   
    

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
