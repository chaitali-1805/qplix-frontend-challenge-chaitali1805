import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, computed, input, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { collectibleAssetData, type CollectibleAssetData } from '../../mocks/dashboard-mock'
import { Chart, type ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("performanceChart") performanceChartRef!: ElementRef<HTMLCanvasElement>

  assetData = input<CollectibleAssetData>(collectibleAssetData)

  currentImageIndex = signal(0)
  selectedChartType = signal<"bar" | "line">("bar")

  private chartInstance: Chart | null = null

  currentAssetData = computed(() => this.assetData())
  totalAppreciation = computed(() => {
    const data = this.currentAssetData()
    return data.currentValue - data.details.acquisitionCost
  })

  appreciationPercentage = computed(() => {
    const data = this.currentAssetData()
    return ((data.currentValue - data.details.acquisitionCost) / data.details.acquisitionCost) * 100
  })

  annualReturn = computed(() => {
    const years = this.currentAssetData().performanceData.length - 1
    const appreciation = this.appreciationPercentage()
    return Math.pow(1 + appreciation / 100, 1 / years) - 1
  })

  private carouselInterval: any

  ngOnInit() {
    this.startCarousel()
  }

  ngAfterViewInit() {
    this.createChart()
  }

  ngOnDestroy() {
    if (this.carouselInterval) clearInterval(this.carouselInterval)
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => this.rotateCarousel(), 5000)
  }

  rotateCarousel() {
    const currentIndex = this.currentImageIndex()
    const nextIndex = (currentIndex + 1) % this.currentAssetData().images.length
    this.currentImageIndex.set(nextIndex)
  }

  setCurrentImage(index: number) {
    this.currentImageIndex.set(index)
    if (this.carouselInterval) clearInterval(this.carouselInterval)
    this.startCarousel()
  }

  toggleChartType() {
    this.selectedChartType.update((c) => (c === "bar" ? "line" : "bar"))
    this.createChart()
  }

  private createChart() {
    if (!this.performanceChartRef) return

    // Destroy existing chart
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }

    const ctx = this.performanceChartRef.nativeElement.getContext("2d")
    if (!ctx) return

    const data = this.currentAssetData().performanceData
    const chartType = this.selectedChartType()

    const config: ChartConfiguration = {
      type: chartType,
      data: {
        labels: data.map((d) => d.year.toString()),
        datasets: [
          {
            label: "Value",
            data: data.map((d) => d.value),
            backgroundColor: chartType === "bar" ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.1)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 3,
            fill: chartType === "line",
            tension: 0.4,
            pointBackgroundColor: "rgb(59, 130, 246)",
            pointBorderColor: "#fff",
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "rgb(30, 64, 175)",
            pointHoverBorderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            titleColor: "#94a3b8",
            bodyColor: "#fff",
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex
                return `Year ${data[index].year}`
              },
              label: (context) => {
                const index = context.dataIndex
                const value = this.formatCurrency(data[index].value, this.currentAssetData().currency)
                return value
              },
              afterLabel: (context) => {
                const index = context.dataIndex
                const appreciation = data[index].appreciation
                if (appreciation > 0) {
                  return `Total appreciation: +${appreciation}%`
                }
                return ""
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => {
                return this.formatCurrency(value as number, this.currentAssetData().currency)
              },
              color: "#94a3b8",
              font: {
                size: 11,
              },
            },
            grid: {
              color: "rgba(59, 130, 246, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#64748b",
              font: {
                size: 12,
                weight: 500,
              },
            },
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeInOutQuart",
        },
      },
    }

    this.chartInstance = new Chart(ctx, config)
  }

  formatCurrency(value: number, currency = "EUR"): string {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
}
