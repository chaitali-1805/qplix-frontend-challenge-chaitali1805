import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, computed, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { collectibleAssetData, type CollectibleAssetData } from '../../mocks/dashboard-mock'

@Component({
  selector: "app-task3",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component implements OnInit, OnDestroy {
  
  assetData = input<CollectibleAssetData>(collectibleAssetData)

  currentImageIndex = signal(0)
  selectedChartType = signal<"bar" | "line">("bar")
  hoveredPointIndex = signal<number | null>(null)

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

  maxValue = computed(() => Math.max(...this.currentAssetData().performanceData.map((d) => d.value)))

  minValue = computed(() => Math.min(...this.currentAssetData().performanceData.map((d) => d.value)))

  lineChartPoints = computed(() => {
    const data = this.currentAssetData().performanceData
    const maxValue = this.maxValue()
    const minValue = this.minValue()
    const range = maxValue - minValue
    const padding = range * 0.15

    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const normalizedValue = ((point.value - minValue) / range) * 70 + 15
      const y = 100 - normalizedValue

      return {
        x,
        y,
        value: point.value,
        year: point.year,
        appreciation: point.appreciation,
        marketTrend: point.marketTrend,
      }
    })
  })

  yearlyGrowth = computed(() => {
    const data = this.currentAssetData().performanceData
    return data.slice(1).map((point, index) => {
      const previousValue = data[index].value
      const currentValue = point.value
      const growth = ((currentValue - previousValue) / previousValue) * 100
      return {
        year: point.year,
        growth: growth,
        amount: currentValue - previousValue,
      }
    })
  })

  private carouselInterval: any

  ngOnInit() {
    this.startCarousel()
    this.animateChartElements()
  }

  ngOnDestroy() {
    if (this.carouselInterval) clearInterval(this.carouselInterval)
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
  }

  getLineChartPath(): string {
    const points = this.lineChartPoints()
    if (points.length === 0) return ""

    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    return path
  }

  onPointHover(index: number | null) {
    this.hoveredPointIndex.set(index)
  }

  private animateChartElements() {
    setTimeout(() => {
      this.animateChartBars()
      this.animateFactorBars()
      this.animateLineChart()
    }, 500)
  }

  private animateChartBars() {
    const bars = document.querySelectorAll(".chart-bar")
    bars.forEach((bar, index) => {
      const barElement = bar as HTMLElement
      const data = this.currentAssetData().performanceData[index]
      const heightPercentage = (data.value / this.maxValue()) * 100
      barElement.style.setProperty("--bar-height", `${heightPercentage}%`)
      setTimeout(() => barElement.classList.add("animated"), index * 150)
    })
  }

  private animateFactorBars() {
    const factorBars = document.querySelectorAll(".factor-fill")
    factorBars.forEach((bar, index) => {
      const barElement = bar as HTMLElement
      const factor = this.currentAssetData().marketFactors[index]
      barElement.style.setProperty("--factor-width", `${factor.value}%`)
      setTimeout(() => barElement.classList.add("animated"), index * 100)
    })
  }

  private animateLineChart() {
    setTimeout(() => {
      const linePath = document.querySelector(".line-chart-path") as SVGPathElement
      const points = document.querySelectorAll(".data-point-circle")

      if (linePath) {
        linePath.classList.add("animated")
      }

      points.forEach((point, index) => {
        setTimeout(() => {
          ;(point as HTMLElement).classList.add("animated")
        }, index * 100)
      })
    }, 300)
  }

  formatCurrency(value: number, currency = "EUR"): string {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  getChartHeight(value: number): number {
    return (value / this.maxValue()) * 100
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case "bullish":
        return "📈"
      case "bearish":
        return "📉"
      default:
        return "➡️"
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case "bullish":
        return "#10b981"
      case "bearish":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }
}
