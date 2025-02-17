import { Component, AfterViewInit, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
  @ViewChild('d3Chart', { static: false }) private chartContainer!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchBudgetData();
      this.createD3Chart();
    }
  }

  fetchBudgetData(): void {
    this.dataService.getBudgetData().subscribe(
      (res: any) => {
        console.log("Loaded budget data from DataService:", res);
        if (!res || res.myBudget.length === 0) {
          console.warn("⚠️ No budget data available!");
          return;
        }
        this.createChart(res.myBudget);
      },
      (error: any) => {
        console.error("Error fetching budget data:", error);
      }
    );
  }

  createChart(data: any): void {
    setTimeout(() => {
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
        data: {
          labels: data.map((item: any) => item.title),
          datasets: [{
            data: data.map((item: any) => item.budget),
            backgroundColor: ['#FFC0CB', '#FFFF00', '#8F00FF', '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      console.log("Pie Chart successfully created!");
    }, 500);
  }

  private createD3Chart(): void {
    if (!this.chartContainer) {
      console.error(" D3 Chart container not found!");
      return;
    }

    const data = [10, 20, 30, 40, 50];
    const width = 400, height = 400;

    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 50)
      .attr('y', (d: any) => height - d * 10)
      .attr('width', 40)
      .attr('height', (d: any) => d * 10)
      .attr('fill', 'blue');

    console.log("D3 Bar Chart successfully created!");
  }
}
