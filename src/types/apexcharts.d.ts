import 'apexcharts'

declare module 'apexcharts' {
  interface ApexOptions {
    plotOptions?: {
      bar?: Record<string, unknown>
      radialBar?: Record<string, unknown>
      pie?: Record<string, unknown>
    }
  }
}
