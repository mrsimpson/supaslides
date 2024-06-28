function generateDistinctColors(count: number): Set<string> {
  const colors = new Set<string>()
  const saturation = 40
  const lightness = 80 // pastel

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((i * 360) / count)
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    colors.add(color)
  }

  return colors
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function getContrastingColor(hsl: string): string {
  const match = hsl.match(/\d+/g)
  if (match) {
    const [hue, saturation, lightness] = match.map(Number)
    const contrastingHue = (hue + 180) % 360
    const contrastingSaturation = 100 - saturation // invert saturation for contrast
    const contrastingLightness = 100 - lightness
    return `hsl(${contrastingHue}, ${contrastingSaturation}%, ${contrastingLightness}%)`
  }
  return 'white'
}

export function getColorsForName(
  name: string,
  count: number
): { color: string; contrastingColor: string } {
  const colors = Array.from(generateDistinctColors(count))
  const hash = hashString(name)
  const index = hash % count
  const color = colors[index]
  const contrastingColor = getContrastingColor(color)
  return { color, contrastingColor }
}
