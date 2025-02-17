import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: ['#FFC0CB', '#FFFF00', '#8F00FF', '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
      }
    ],
    labels: [] as string[]
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getBudget();
    }
  }

  getBudget(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http.get<{ myBudget: any }>('http://localhost:3000/budget')
      .subscribe(
        (res: any) => {
          console.log("Loaded budget data:", res);

          for (let i = 0; i < res.myBudget.length; i++) {
            this.dataSource.datasets[0].data.push(res.myBudget[i].budget as number);
            this.dataSource.labels.push(res.myBudget[i].title as string);
          }

          this.createChart();
        },
        (error) => {
          console.error("Error loading budget data:", error);
        }
      );
  }

  createChart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error("Canvas element 'myChart' not found!");
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error("Failed to get 2D context from canvas!");
      return;
    }

    console.log("Creating Pie Chart...");

    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    console.log("Pie Chart successfully created!");
  }
}
