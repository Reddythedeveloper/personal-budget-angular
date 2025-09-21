import { Component, OnInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Article } from '../article/article';
import { DataService } from '../data';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [Article, Breadcrumbs],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage implements OnInit {

  constructor(
    private dataService: DataService,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Component initialized in browser. Fetching data...");
      this.dataService.getBudget().subscribe({
        next: (data) => {
          console.log("Data successfully fetched:", data);
          if (data && data.myBudget && data.myBudget.length > 0) {
            this.createD3Chart(data.myBudget);
          } else {
            console.error("Data is empty or not in the expected format.");
          }
        },
        error: (err) => {
          console.error("ERROR fetching budget data:", err);
        }
      });
    }
  }

  createD3Chart(data: any[]): void {
    console.log("Creating D3 chart with data:", data);
    const width = 350;
    const height = 350;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svgContainer = d3.select(this.el.nativeElement).select('#pie');
    if (svgContainer.empty()) {
        console.error("D3 could not find the '#pie' container element.");
        return;
    }
    svgContainer.selectAll("*").remove();

    const svg = svgContainer
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.title))
      .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#9966ff', '#4bc0c0']);

    const pie = d3.pie<any>().value((d) => d.budget);
    const data_ready = pie(data);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator as any)
      .attr('fill', (d) => color(d.data.title) as any)
      .attr('stroke', '#ffffff')
      .style('stroke-width', '2px');

    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d) => d.data.title)
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d as any)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14);

    console.log("Chart creation complete.");
  }
}

