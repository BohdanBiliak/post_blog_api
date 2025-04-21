export const funcSleep = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}